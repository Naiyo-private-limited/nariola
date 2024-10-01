const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../utils/authMiddleware');

// User Profile
router.get('/profile', authMiddleware, userController.getProfile);

// Update Location
router.put('/location', authMiddleware, userController.updateLocation);

// Record Video Call
// router.post('/video-record', authMiddleware, userController.recordVideoCall);

module.exports = router;
