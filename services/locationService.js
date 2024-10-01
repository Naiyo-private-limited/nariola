const db = require('../models');

exports.updateLocation = async (req, res) => {
  const { latitude, longitude } = req.body;
  const user = await db.User.findByPk(req.user.id);

  if (!user) return res.status(404).json({ message: 'User not found' });

  user.currentLocation = {
    type: 'Point',
    coordinates: [longitude, latitude]
  };

  await user.save();
  res.json({ message: 'Location updated successfully' });
};
