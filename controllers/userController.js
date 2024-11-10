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

// Search user by email and add as emergency contact
exports.addEmergencyContactByEmail = async (req, res) => {
  try {
    const userId = req.params.userId; // Get user ID from URL params
    const { email } = req.body; // Get email from request body

    // Find the user who is adding the emergency contact
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the user by email who is to be added as an emergency contact
    const contactUser = await db.User.findOne({ where: { email } });
    if (!contactUser) {
      return res.status(404).json({ message: 'Contact user not found by this email' });
    }

    // Initialize emergencyContacts array if not present
    let emergencyContacts = user.emergencyContacts || [];

    // Check if the contactUser is already in emergency contacts
    if (emergencyContacts.includes(contactUser.id.toString())) {
      return res.status(400).json({ message: 'This user is already added as an emergency contact' });
    }

    // Add the new contact if less than 12 contacts exist
    if (emergencyContacts.length < 12) {
      emergencyContacts.push(contactUser.id.toString()); // Convert to string to maintain consistency

      // Explicitly update the emergencyContacts field in the database
      await db.User.update(
        { emergencyContacts },
        { where: { id: userId } }
      );

      return res.status(201).json({
        message: 'Emergency contact added successfully',
        emergencyContacts
      });
    } else {
      return res.status(400).json({ message: 'Maximum of 12 emergency contacts allowed' });
    }
  } catch (error) {
    console.error('Error adding emergency contact:', error);
    res.status(500).json({ message: 'Error adding emergency contact', error });
  }
};

// Get full user details of emergency contacts
exports.getEmergencyContactDetails = async (req, res) => {
  try {
    const userId = req.params.userId; // Get user ID from URL params
    const user = await db.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure emergencyContacts is an array
    const emergencyContactsIds = user.emergencyContacts || [];

    // Fetch full details of each contact by user IDs
    const emergencyContacts = await db.User.findAll({
      where: {
        id: emergencyContactsIds
      },
      attributes: ['id', 'email', 'username','photo'] // Ensure 'fullName' matches the actual column in your DB
    });

    // Return the list of emergency contacts
    res.status(200).json({ emergencyContacts });
  } catch (error) {
    console.error('Error fetching emergency contact details:', error);
    res.status(500).json({ message: 'Error fetching emergency contact details', error });
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

// Get all user details except the password
exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: { exclude: ['password'] } // Exclude the password field
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Get the count of users
exports.getUserCount = async (req, res) => {
  try {
    const userCount = await db.User.count(); // Count all users
    res.status(200).json({ count: userCount });
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({ message: 'Error fetching user count', error });
  }
};
