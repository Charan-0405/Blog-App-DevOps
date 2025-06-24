const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/profileController');

// GET profile
router.get('/', auth, getProfile);

// UPDATE profile
router.put('/', auth, updateProfile);

module.exports = router;
