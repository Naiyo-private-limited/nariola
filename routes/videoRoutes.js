const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');  // Add fs for folder creation
const { VideoRecord } = require('../models');  // Adjust path to your models
const router = express.Router();
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');  // For ffmpeg binary
const ffprobeStatic = require('ffprobe-static'); // For ffprobe binary

// Set ffmpeg and ffprobe paths
ffmpeg.setFfmpegPath(ffmpegStatic);
ffmpeg.setFfprobePath(ffprobeStatic.path); // Set the ffprobe path

// Set up storage for uploaded videos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.body.userId;
    const userDir = path.join(__dirname, '..', 'uploads', 'videos', userId.toString()); // Folder path based on userId

    // Check if the folder exists, create it if not
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });  // Create folder recursively
    }

    cb(null, userDir);  // Save video in the user-specific folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.mp4';  // Default to .mp4 if no extension
    cb(null, Date.now() + ext);  // Save with a timestamp to avoid overwriting
  }
});

// Update the fileFilter function to allow .temp files and handle MIME types
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /mp4|mov|avi|mkv|temp/;  // Allow .temp and video formats
    const extname = path.extname(file.originalname).toLowerCase();
    const isExtensionAllowed = allowedFileTypes.test(extname) || extname === '.temp';
    const mimetype = file.mimetype.startsWith('video/') || file.mimetype === 'application/octet-stream';  // Allow 'application/octet-stream' for videos

    // Log file extension and MIME type for debugging
    console.log('File original name:', file.originalname);
    console.log('File extension:', extname);
    console.log('MIME type:', file.mimetype);
    console.log('Is extension allowed:', isExtensionAllowed);
    console.log('Is MIME type video:', mimetype);

    if (isExtensionAllowed && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error('Only video files are allowed!'));
    }
  }
});

// Route for uploading a video
router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a video file.' });
    }

    // Path to the uploaded video
    const videoPath = path.join(__dirname, '../uploads/videos', userId, req.file.filename);

    // Log the video path for debugging
    console.log('Video Path:', videoPath);

    // Get video metadata, including duration
    ffmpeg.ffprobe(videoPath, async (err, metadata) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to process video metadata', error: err.message });
      }

      const duration = Math.round(metadata.format.duration); // Round the duration to the nearest integer

      // Save the video record with the uploaded video URL, user ID, and duration
      const videoRecord = await VideoRecord.create({
        url: `http://34.171.9.179:5000/uploads/videos/${userId}/${req.file.filename}`, // Save path of the uploaded video
        userId: userId, // Associate the video with the user from request body
        duration: duration // Store the rounded duration as an integer
      });

      res.status(201).json({
        message: 'Video uploaded successfully!',
        video: videoRecord
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to upload video', error: error.message });
  }
});

module.exports = router;


// Route to get videos by userId
router.get('/videos/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Query the VideoRecord model for videos associated with this userId
    const videos = await VideoRecord.findAll({ where: { userId } });

    if (videos.length === 0) {
      return res.status(404).json({ message: 'No videos found for this user.' });
    }

    res.status(200).json({ videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch videos', error: error.message });
  }
});

module.exports = router;


// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');  // Add fs for folder creation
// const { VideoRecord } = require('../models');  // Adjust path to your models
// const router = express.Router();
// const ffmpeg = require('fluent-ffmpeg');
// const ffmpegStatic = require('ffmpeg-static');  // For ffmpeg binary
// const ffprobeStatic = require('ffprobe-static'); // For ffprobe binary

// // Set ffmpeg and ffprobe paths
// ffmpeg.setFfmpegPath(ffmpegStatic);
// ffmpeg.setFfprobePath(ffprobeStatic.path); // Set the ffprobe path

// // Set up storage for uploaded videos
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const userId = req.body.userId;
//     const userDir = path.join(__dirname, '..', 'uploads', 'videos', userId.toString()); // Folder path based on userId

//     // Check if the folder exists, create it if not
//     if (!fs.existsSync(userDir)) {
//       fs.mkdirSync(userDir, { recursive: true });  // Create folder recursively
//     }

//     cb(null, userDir);  // Save video in the user-specific folder
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, Date.now() + ext);  // Save with a timestamp to avoid overwriting
//   }
// });

// const upload = multer({
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//       const allowedFileTypes = /mp4|mov|avi|mkv/;  // Allowed video formats
//       const extname = path.extname(file.originalname).toLowerCase();
//       const isExtensionAllowed = allowedFileTypes.test(extname);
//       const mimetype = file.mimetype.startsWith('video/') || file.mimetype === 'application/octet-stream';  // Allow 'application/octet-stream' for videos
  
//       // Log file extension and MIME type for debugging
//       console.log('File original name:', file.originalname);
//       console.log('File extension:', extname);
//       console.log('MIME type:', file.mimetype);
//       console.log('Is extension allowed:', isExtensionAllowed);
//       console.log('Is MIME type video:', mimetype);
  
//       if (isExtensionAllowed && mimetype) {
//         return cb(null, true);
//       } else {
//         return cb(new Error('Only video files are allowed!'));
//       }
//     }
//   });
  

// // Route for uploading a video
// router.post('/upload', upload.single('video'), async (req, res) => {
//   try {
//     const userId = req.body.userId;

//     if (!req.file) {
//       return res.status(400).json({ message: 'Please upload a video file.' });
//     }

//     // Path to the uploaded video
//     const videoPath = path.join(__dirname, '../uploads/videos', userId, req.file.filename);

//     // Log the video path for debugging
//     console.log('Video Path:', videoPath);

//     // Get video metadata, including duration
//     ffmpeg.ffprobe(videoPath, async (err, metadata) => {
//       if (err) {
//         return res.status(500).json({ message: 'Failed to process video metadata', error: err.message });
//       }

//       const duration = Math.round(metadata.format.duration); // Round the duration to the nearest integer

//       // Save the video record with the uploaded video URL, user ID, and duration
//       const videoRecord = await VideoRecord.create({
//         url: `/uploads/videos/${userId}/${req.file.filename}`, // Save path of the uploaded video
//         userId: userId, // Associate the video with the user from request body
//         duration: duration // Store the rounded duration as an integer
//       });

//       res.status(201).json({
//         message: 'Video uploaded successfully!',
//         video: videoRecord
//       });
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to upload video', error: error.message });
//   }
// });

// module.exports = router;
