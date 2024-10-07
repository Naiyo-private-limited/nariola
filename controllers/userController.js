const db = require('../models');

// Update user's current location
exports.updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const user = await db.User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.currentLocation = {
      type: 'Point',
      coordinates: [longitude, latitude]
    };

    await user.save();
    res.status(200).json({ message: 'Location updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating location', error });
  }
};

// Fetch user's profile by user ID from the URL
exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract userId from URL params
    const user = await db.User.findByPk(userId, {
      include: [db.VideoRecord] // Include associated VideoRecord data
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};

// Add emergency contact
exports.addEmergencyContact = async (req, res) => {
  try {
    const userId = req.params.userId; // Get user ID from URL params
    const { contact } = req.body; // The emergency contact to be added

    const user = await db.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if emergencyContacts array exists, if not, initialize it
    if (!user.emergencyContacts) {
      user.emergencyContacts = [];
    }

    // Check if the contact already exists
    if (user.emergencyContacts.includes(contact)) {
      return res.status(400).json({ message: 'Contact already exists' });
    }

    // Add the new contact to the array (max 12 contacts)
    if (user.emergencyContacts.length < 12) {
      user.emergencyContacts.push(contact);
      await user.save();
      return res.status(201).json({ message: 'Emergency contact added successfully', emergencyContacts: user.emergencyContacts });
    } else {
      return res.status(400).json({ message: 'Maximum of 12 emergency contacts allowed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error adding emergency contact', error });
  }
};

// Get all emergency contacts
exports.getEmergencyContacts = async (req, res) => {
  try {
    const userId = req.params.userId; // Get user ID from URL params
    const user = await db.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure emergencyContacts is an array, even if it's null
    const emergencyContacts = user.emergencyContacts || [];

    // Return the emergency contacts in the response
    res.status(200).json({ emergencyContacts });
  } catch (error) {
    console.error('Error fetching emergency contacts:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error fetching emergency contacts', error });
  }
};

