const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const newUser = new User({
      username: username.trim(),
      email: email.trim(),
      password: password,
    });

    await newUser.save();
    res.status(201).json({ msg: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login Attempt');
    console.log('📩 Email:', email);
    console.log('🔑 Password (entered):', password);

    const user = await User.findOne({ email });

    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ msg: 'User not found' });
    }

    console.log('🗂 Stored hash in DB:', user.password);

    const isMatch = (password===user.password)

    if (!isMatch) {
      console.log('❌ Invalid credentials');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

   const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });


    console.log('🎉 Login successful. Token generated.');

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    console.error('🚨 Server Error during login:', err.message);
    res.status(500).json({ msg: 'Server error during login' });
  }
};