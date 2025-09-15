import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Common validation schemas
export const schemas = {
  // User schemas
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required',
    }),
    fullName: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Full name must be at least 2 characters long',
      'string.max': 'Full name cannot exceed 100 characters',
      'any.required': 'Full name is required',
    }),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional().messages({
      'string.pattern.base': 'Please provide a valid phone number',
    }),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  updateProfile: Joi.object({
    fullName: Joi.string().min(2).max(100).optional(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
  }),

  // Pet schemas
  createPet: Joi.object({
    name: Joi.string().min(1).max(50).required().messages({
      'string.min': 'Pet name is required',
      'string.max': 'Pet name cannot exceed 50 characters',
      'any.required': 'Pet name is required',
    }),
    type: Joi.string().valid('Dog', 'Cat', 'Bird', 'Rabbit', 'Fish', 'Other').required(),
    breed: Joi.string().max(50).optional(),
    age: Joi.number().integer().min(0).max(30).optional(),
    weight: Joi.number().positive().max(200).optional(),
    specialNotes: Joi.string().max(500).optional(),
  }),

  // Booking schemas
  createBooking: Joi.object({
    serviceId: Joi.string().required(),
    petId: Joi.string().required(),
    scheduledAt: Joi.date().iso().greater('now').required().messages({
      'date.greater': 'Scheduled date must be in the future',
      'any.required': 'Scheduled date is required',
    }),
    notes: Joi.string().max(500).optional(),
    address: Joi.string().min(10).max(200).required().messages({
      'string.min': 'Address must be at least 10 characters long',
      'any.required': 'Address is required',
    }),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required().messages({
      'string.pattern.base': 'Please provide a valid phone number',
      'any.required': 'Phone number is required',
    }),
  }),

  // Cart schemas
  addToCart: Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).max(10).required().messages({
      'number.min': 'Quantity must be at least 1',
      'number.max': 'Quantity cannot exceed 10',
      'any.required': 'Quantity is required',
    }),
  }),

  updateCartItem: Joi.object({
    quantity: Joi.number().integer().min(0).max(10).required(),
  }),

  // Address schemas
  createAddress: Joi.object({
    type: Joi.string().valid('HOME', 'WORK', 'OTHER').required(),
    street: Joi.string().min(5).max(200).required(),
    city: Joi.string().min(2).max(50).required(),
    state: Joi.string().min(2).max(50).required(),
    zipCode: Joi.string().min(4).max(10).required(),
    country: Joi.string().default('India'),
  }),

  // Review schemas
  createReview: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required().messages({
      'number.min': 'Rating must be between 1 and 5',
      'number.max': 'Rating must be between 1 and 5',
      'any.required': 'Rating is required',
    }),
    comment: Joi.string().max(1000).optional(),
  }),
};

// Validation middleware factory
export function validateSchema(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
}

// Query parameter validation
export function validateQuery(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Query validation failed',
        errors,
      });
    }

    req.query = value;
    next();
  };
}