const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  const { fullName, phone, birthDate, password, gender, address, country, city } = req.body;

  if (!fullName || !phone || !birthDate || !password) {
    return res.status(400).json({ message: "Required fields are missing." });
  }

  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      phone,
      birthDate,
      password: hashedPassword,
      gender,
      address,
      country,
      city
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully." });

  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    res.json({
      message: "Login successful.",
      fullName: user.fullName
    });

  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

// Additional validation 
const { fullName, phone, birthDate, password, gender, address, country, city } = req.body;

if (!fullName?.trim() || !phone?.trim() || !birthDate || !password?.trim()) {
  return res.status(400).json({ message: "Required fields are missing." });
}

// Phone validation 
if (!/^\+?\d{10,15}$/.test(phone.trim())) {
  return res.status(400).json({ message: "Invalid phone number." });
}

//after successful match:
req.session.user = { id: user._id, phone: user.phone, fullName: user.fullName }; // If using express-session
res.json({
  message: "Login successful.",
  fullName: user.fullName
});
module.exports = router;
