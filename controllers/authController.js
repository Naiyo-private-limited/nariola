const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, 'jwtSecretKey', { expiresIn: '1h' });

    // Send response with token, user details, and success message
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        emergencyContacts: user.emergencyContacts,
        liveLocationLink: user.liveLocationLink,
        photo: user.photo,
        createdAt: user.createdAt,
        // Add any other user fields you want to include here
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.register = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await db.User.findOne({ where: { email } });
  if (existingUser) return res.status(400).json({ message: 'Email already registered' });

  const user = await db.User.create({ email, password });
  res.status(201).json(user);
};
