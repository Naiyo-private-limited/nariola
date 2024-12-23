// const db = require('../models');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const multer = require('multer');

// // Set up storage engine
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads'); // Save to 'uploads' directory
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname)); // Append current time to file name for uniqueness
//   }
// });

// // Init upload
// const upload = multer({ storage: storage });
// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Find user by email
//     const user = await db.User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: user.id }, 'jwtSecretKey', { expiresIn: '1h' });

//     // Send response with token, user details, and success message
//     res.json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         emergencyContacts: user.emergencyContacts,
//         liveLocationLink: user.liveLocationLink,
//         photo: user.photo,
//         createdAt: user.createdAt,
//         // Add any other user fields you want to include here
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// exports.register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     console.log(req.body);  // Check if email and other fields are coming through
//     console.log(req.file);  // Check if file is being uploaded properly

//     // Check if email is already registered
//     const existingUser = await db.User.findOne({ where: { email } });
//     if (!email) {
//       return res.status(400).json({ message: 'Email is required' });
//     }
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email already registered' });
//     }

//     // Generate the full URL for the uploaded image
//     const serverIP = 'http://34.171.9.179:5000'; // Replace with your actual server IP or domain
//     const mediaUrl = req.file ? `${serverIP}/uploads/${req.file.filename}` : null;

//     // Create the new user
//     const user = await db.User.create({
//       username: name,  // Storing the name as username
//       email,
//       password,       // Password will be hashed in the User model's hook (beforeCreate)
//       photo: mediaUrl // Optional: Photo URL if provided
//     });

//     // Respond with the created user, excluding the password
//     const userWithoutPassword = {
//       id: user.id,
//       username: user.username,
//       email: user.email,
//       photo: user.photo,
//       accountType: user.accountType, // The default will be 'standard'
//       createdAt: user.createdAt
//     };

//     res.status(201).json(userWithoutPassword);
//   } catch (error) {
//     console.error('Error in registration:', error);
//     res.status(500).json({ message: 'Server error. Please try again.' });
//   }
// };
const db = require('../models');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path'); // Ensure 'path' is imported

// Set up storage engine for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Save to 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append current time to file name for uniqueness
  }
});

const upload = multer({ storage: storage }).single('photo'); // Using single middleware

exports.register = async (req, res) => {
  // Handle file upload
  upload(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(500).json({ message: 'File upload error', error: err });
    }

    try {
      const { name, email, password } = req.body;

      // Logging the request body and file info for debugging
      console.log('Request body:', req.body);
      console.log('Uploaded file:', req.file);

      // Check if required fields are provided
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
      }

      // Check if email is already registered
      const existingEmailUser = await db.User.findOne({ where: { email } });
      if (existingEmailUser) {
        return res.status(400).json({ message: 'Email is already registered' });
      }

      // Check if username is already taken
      const existingUsernameUser = await db.User.findOne({ where: { username: name } });
      if (existingUsernameUser) {
        return res.status(400).json({ message: 'Username is already taken' });
      }

      // Generate the full URL for the uploaded image, if available
      const serverIP = 'http://34.171.9.179:5000'; // Replace with your actual server IP or domain
      const mediaUrl = req.file ? `${serverIP}/uploads/${req.file.filename}` : null;

      // Create the new user without hashing the password
      const user = await db.User.create({
        username: name,
        email,
        password, // Storing the password as plain text
        photo: mediaUrl || null // Optional: Photo URL if provided
      });

      // Generate JWT token for the user
      const token = jwt.sign({ id: user.id }, 'jwtSecretKey', { expiresIn: '1h' });

      // Respond with the created user, excluding the password
      const userWithoutPassword = {
        message: 'Registration successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          emergencyContacts: user.emergencyContacts || [],
          liveLocationLink: user.liveLocationLink || null,
          photo: user.photo,
          createdAt: user.createdAt,
        },
      };

      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error('Error in registration:', error);
      
      // Check if error is a Sequelize unique constraint error
      if (error.name === 'SequelizeUniqueConstraintError') {
        const field = error.errors[0]?.path || 'field';
        return res.status(400).json({ message: `${field} must be unique` });
      }

      res.status(500).json({ message: 'Server error. Please try again.' });
    }
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if the provided password matches the user's password
    if (password !== user.password) {
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
