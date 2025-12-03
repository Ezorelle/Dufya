const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { fullName, phone, birthDate, password, gender, address, country, city } = req.body;

  if (!fullName || !phone || !birthDate || !password) {
    return res.status(400).json({ message: 'Required fields are missing.' });
  }

  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const newUser = new User({
      fullName,
      phone,
      birthDate,
      password,
      gender,
      address,
      country,
      city
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully.' });

  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
});

router.post('/login', async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    res.json({ message: 'Login successful.', fullName: user.fullName });

  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
});

module.exports = router;