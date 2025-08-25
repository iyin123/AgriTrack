const express = require('express');
const UserService = require('../services/userService.js');
const { requireUser } = require('./middleware/auth.js');

const router = express.Router();

// Get current user profile
router.get('/me', requireUser, async (req, res) => {
  try {
    console.log('Fetching profile for user:', req.user._id);
    
    const user = await UserService.get(req.user._id);
    
    if (!user) {
      console.log('User not found:', req.user._id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Profile fetched successfully for user:', user.email);
    return res.status(200).json({ profile: user });
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    return res.status(500).json({ message: 'Failed to fetch user profile' });
  }
});

// Update current user profile
router.put('/me', requireUser, async (req, res) => {
  try {
    const { firstName, lastName, farmName, farmLocation, farmSize } = req.body;
    
    console.log('Updating profile for user:', req.user._id);

    // Validate required fields
    if (!firstName || !lastName) {
      return res.status(400).json({ 
        message: 'First name and last name are required' 
      });
    }

    const updateData = {
      firstName,
      lastName,
      farmName,
      farmLocation,
      farmSize
    };

    const updatedUser = await UserService.update(req.user._id, updateData);
    
    if (!updatedUser) {
      console.log('User not found for update:', req.user._id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Profile updated successfully for user:', updatedUser.email);
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedUser
    });
  } catch (error) {
    console.error('Error updating user profile:', error.message);
    return res.status(500).json({ message: 'Failed to update user profile' });
  }
});

module.exports = router;