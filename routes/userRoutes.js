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
// Route to add emergency contact by email
router.post('/:userId/emergency-contacts', userController.addEmergencyContactByEmail);

// Route to get full emergency contact details
router.get('/:userId/emergency-contacts', userController.getEmergencyContactDetails);
// Record Video Call

module.exports = router;
