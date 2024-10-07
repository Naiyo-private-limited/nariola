const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../utils/authMiddleware');

// User Profile
router.get('/profile/:userId', userController.getProfile);

// Update Location
router.put('/location', authMiddleware, userController.updateLocation);
// Add emergency contact
router.post('/emergency-contacts/:userId', userController.addEmergencyContact);

// Get all emergency contacts
router.get('/emergency-contacts/:userId', userController.getEmergencyContacts);
// Record Video Call
// router.post('/video-record', authMiddleware, userController.recordVideoCall);

module.exports = router;
