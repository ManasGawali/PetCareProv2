import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../utils/database';
import { generateToken } from '../utils/jwt';
import { validateSchema, schemas } from '../utils/validation';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Register new user
router.post('/register', validateSchema(schemas.register), asyncHandler(async (req: Request, res: Response) => {
  const { email, password, fullName, phone } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'User with this email already exists',
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      fullName,
      phone: phone || null,
      verified: true, // Auto-verify for development
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      role: true,
      verified: true,
      createdAt: true,
    },
  });

  // Generate JWT token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      token,
    },
  });
}));

// Login user
router.post('/login', validateSchema(schemas.login), asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: {
      id: true,
      email: true,
      password: true,
      fullName: true,
      phone: true,
      role: true,
      verified: true,
      createdAt: true,
    },
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  if (!user.verified) {
    return res.status(401).json({
      success: false,
      message: 'Please verify your email before logging in',
    });
  }

  // Generate JWT token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: userWithoutPassword,
      token,
    },
  });
}));

// Get current user profile
router.get('/me', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      avatar: true,
      role: true,
      verified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.json({
    success: true,
    data: { user },
  });
}));

// Update user profile
router.put('/profile', authenticateToken, validateSchema(schemas.updateProfile), asyncHandler(async (req: Request, res: Response) => {
  const { fullName, phone } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      ...(fullName && { fullName }),
      ...(phone && { phone }),
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      avatar: true,
      role: true,
      verified: true,
      updatedAt: true,
    },
  });

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user: updatedUser },
  });
}));

// Logout (client-side token removal)
router.post('/logout', authenticateToken, (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// Password reset (simplified for development)
router.post('/forgot-password', validateSchema(
  schemas.login.fork(['password'], (schema) => schema.forbidden())
), asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true, email: true },
  });

  // Always return success for security (don't reveal if email exists)
  res.json({
    success: true,
    message: 'If an account with this email exists, a password reset link has been sent',
  });

  // In a real application, you would:
  // 1. Generate a secure reset token
  // 2. Store it in the database with expiration
  // 3. Send email with reset link
  console.log(`Password reset requested for: ${email}`);
}));

export default router;