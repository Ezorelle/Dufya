const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router(); // Use router instead of app

// POST /api/register
router.post("/", async (req, res) => {
  const {
    fullName,
    email,
    phone,
    birthDate,
    password,
    gender,
    address,
    country,
    city,
  } = req.body;

  if (!fullName || !phone || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Full name, phone, and password are required" });
  }

  try {
    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User with this phone already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      phone,
      birthDate,
      password: hashedPassword,
      gender,
      address,
      country,
      city,
    });

    await newUser.save();

    return res
      .status(201)
      .json({ success: true, message: "Registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Registration failed" });
  }
});

module.exports = router;
