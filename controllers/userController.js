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

// Fetch user's profile
exports.getProfile = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      include: [db.VideoRecord]
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};



