import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'petcare-pro',
  });
}

export function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
}

export function refreshToken(oldToken: string): string {
  try {
    const decoded = jwt.verify(oldToken, JWT_SECRET, { ignoreExpiration: true }) as JWTPayload;
    
    // Generate new token with same payload
    return generateToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });
  } catch (error) {
    throw new Error('Token refresh failed');
  }
}