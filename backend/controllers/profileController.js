const User = require('../models/User');

// GET /api/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// PUT /api/profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;
    const user = await User.findById(req.user.id);
    if (username) user.username = username;
    if (bio) user.bio = bio;
    await user.save();
    res.status(200).json({ msg: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
