const express = require('express');
const router = express.Router();
const sponsorController = require('../controllers/sponsorController');

// Route to create a new sponsor
router.post('/sponsors', sponsorController.createSponsor);

// Route to get all sponsors
router.get('/sponsors', sponsorController.getAllSponsors);

// Route to get a sponsor by ID
router.get('/sponsors/:id', sponsorController.getSponsorById);

// Route to update a sponsor
router.put('/sponsors/:id', sponsorController.updateSponsor);

// Route to delete a sponsor
router.delete('/sponsors/:id', sponsorController.deleteSponsor);

module.exports = router;
