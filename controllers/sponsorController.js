const { Sponsor } = require('../models');
const multer = require('multer');
const path = require('path');

// Set up Multer to store files in 'uploads' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Rename file to avoid duplicates and save with timestamp prefix
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Define file filter for image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'), false);
  }
};

// Initialize multer with storage settings and file filter
const upload = multer({ storage, fileFilter });

// Updated createSponsor function to handle file upload
exports.createSponsor = [
  upload.single('image'), // Middleware to handle single image file upload
  async (req, res) => {
    try {
      const { name } = req.body;
      
      const serverIP = 'http://34.171.9.179:5000'; // Replace with your actual server IP or domain
      const mediaUrl = req.file ? `${serverIP}/uploads/${req.file.filename}` : null;

      // Save sponsor with the image path
      const sponsor = await Sponsor.create({ name, image: mediaUrl });
      
      res.status(201).json(sponsor);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create sponsor' });
    }
  }
];

// Get all sponsors
exports.getAllSponsors = async (req, res) => {
  try {
    const sponsors = await Sponsor.findAll();
    res.status(200).json(sponsors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve sponsors' });
  }
};

// Get a sponsor by ID
exports.getSponsorById = async (req, res) => {
  try {
    const { id } = req.params;
    const sponsor = await Sponsor.findByPk(id);
    if (!sponsor) {
      return res.status(404).json({ error: 'Sponsor not found' });
    }
    res.status(200).json(sponsor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve sponsor' });
  }
};

// Update a sponsor
exports.updateSponsor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;
    const sponsor = await Sponsor.findByPk(id);
    if (!sponsor) {
      return res.status(404).json({ error: 'Sponsor not found' });
    }
    await sponsor.update({ name, image });
    res.status(200).json(sponsor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update sponsor' });
  }
};

// Delete a sponsor
exports.deleteSponsor = async (req, res) => {
  try {
    const { id } = req.params;
    const sponsor = await Sponsor.findByPk(id);
    if (!sponsor) {
      return res.status(404).json({ error: 'Sponsor not found' });
    }
    await sponsor.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete sponsor' });
  }
};
