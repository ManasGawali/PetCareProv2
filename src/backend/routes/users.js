const express = require('express');
const { body, validationResult } = require('express-validator');
const { User, Pet } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Pet,
          as: 'pets',
          where: { is_active: true },
          required: false
        }
      ]
    });

    res.json({
      success: true,
      data: { user: user.getPublicProfile() }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('full_name').optional().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('address').optional().isLength({ min: 5 }).withMessage('Address must be at least 5 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const updates = req.body;
    // Remove sensitive fields
    delete updates.email;
    delete updates.password;
    delete updates.is_verified;
    delete updates.is_active;

    await req.user.update(updates);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: req.user.getPublicProfile() }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/users/pets
// @desc    Add a new pet
// @access  Private
router.post('/pets', [
  auth,
  body('name').isLength({ min: 1, max: 50 }).withMessage('Pet name is required and must be less than 50 characters'),
  body('type').isIn(['dog', 'cat', 'bird', 'rabbit', 'fish', 'reptile', 'other']).withMessage('Valid pet type is required'),
  body('size_category').isIn(['small', 'medium', 'large', 'extra_large']).withMessage('Valid size category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const petData = {
      ...req.body,
      user_id: req.user.id
    };

    const pet = await Pet.create(petData);

    res.status(201).json({
      success: true,
      message: 'Pet added successfully',
      data: { pet }
    });
  } catch (error) {
    console.error('Add pet error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/pets
// @desc    Get user's pets
// @access  Private
router.get('/pets', auth, async (req, res) => {
  try {
    const pets = await Pet.findAll({
      where: {
        user_id: req.user.id,
        is_active: true
      },
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: { pets }
    });
  } catch (error) {
    console.error('Get pets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/pets/:id
// @desc    Update pet information
// @access  Private
router.put('/pets/:id', [
  auth,
  body('name').optional().isLength({ min: 1, max: 50 }).withMessage('Pet name must be less than 50 characters'),
  body('type').optional().isIn(['dog', 'cat', 'bird', 'rabbit', 'fish', 'reptile', 'other']).withMessage('Valid pet type is required'),
  body('size_category').optional().isIn(['small', 'medium', 'large', 'extra_large']).withMessage('Valid size category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const pet = await Pet.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
        is_active: true
      }
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    await pet.update(req.body);

    res.json({
      success: true,
      message: 'Pet updated successfully',
      data: { pet }
    });
  } catch (error) {
    console.error('Update pet error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/users/pets/:id
// @desc    Delete (deactivate) a pet
// @access  Private
router.delete('/pets/:id', auth, async (req, res) => {
  try {
    const pet = await Pet.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
        is_active: true
      }
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    await pet.update({ is_active: false });

    res.json({
      success: true,
      message: 'Pet removed successfully'
    });
  } catch (error) {
    console.error('Delete pet error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', [
  auth,
  body('preferences').isObject().withMessage('Preferences must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { preferences } = req.body;

    // Merge with existing preferences
    const currentPreferences = req.user.preferences || {};
    const updatedPreferences = {
      ...currentPreferences,
      ...preferences
    };

    await req.user.update({ preferences: updatedPreferences });

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: { preferences: updatedPreferences }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;