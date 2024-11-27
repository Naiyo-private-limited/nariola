// routes/liveLocation.js

const express = require('express');
const router = express.Router();
const { LiveLocation } = require('../models');
const path = require('path');

router.use(express.static(path.join(__dirname, 'pages')));

// POST /location
router.post('/location', async (req, res) => {
    try {
      const { userId, longitude, latitude, sessionId } = req.body;
  
      // Check if sessionId is provided
      if (!sessionId) {
        return res.status(400).json({ error: 'sessionId is required' });
      }
  
      const location = await LiveLocation.create({
        userId,
        longitude,
        latitude,
        sessionId,
      });
  
      res.status(201).json({ message: 'Location saved', sessionId });
    } catch (error) {
      console.error(error);  // Log the error for details
      res.status(500).json({ error: 'Failed to save location', details: error.message });
    }
  });
  
  module.exports = router;
  


// routes/liveLocation.js

// // GET /location/:userId
// router.get('/location/:userId', async (req, res) => {
//     try {
//         const { userId } = req.params;

//         // Fetch all locations for the user
//         const locations = await LiveLocation.findAll({
//             where: { userId },
//             order: [['timestamp', 'DESC']],  // Order by most recent location first
//         });

//         if (locations.length === 0) {
//             return res.status(404).json({ error: 'No location history found for this user' });
//         }

//         // Get the latest location (current location)
//         const currentLocation = locations[0];
//         const { latitude: currentLat, longitude: currentLon } = currentLocation;

//         // Generate the Google Maps link for the current location
//         const currentLocationLink = `https://www.google.com/maps/search/?api=1&query=${currentLat},${currentLon}`;

//         // Generate Google Maps link with location history markers
//         const locationMarkers = locations.map(location => `${location.latitude},${location.longitude}`).join('|');
//         const historyMapLink = `https://www.google.com/maps/dir/${locationMarkers}`;

//         // Send the links in the response
//         res.status(200).json({
//             message: 'Location history retrieved',
//             currentLocationLink,
//             historyMapLink,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to retrieve location history' });
//     }
// });

// module.exports = router;

// Serve the dynamic map page
router.get('/map/:userId', (req, res) => {
  const { userId } = req.params;
  res.sendFile(path.join(__dirname, '../pages/map.html')); // Serve the map HTML file
});

// API to get the latest location data for a user
router.get('/location/:userId', async (req, res) => {
  try {
      const { userId } = req.params;

      // Fetch the most recent location for the user
      const location = await LiveLocation.findOne({
          where: { userId },
          order: [['timestamp', 'DESC']], // Get the latest location
      });

      if (!location) {
          return res.status(404).json({ error: 'No location history found for this user' });
      }

      // Respond with latitude and longitude
      res.json({
          latitude: location.latitude,
          longitude: location.longitude,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve location history' });
  }
});



  