const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router(); 

// POST /api/login
router.post("/", async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ success: false, message: "Phone and password are required" });
  }

  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(401).json({ success: false, message: "Invalid phone or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid phone or password" });

    // Save user info in session (session should already be initialized in server.js)
    req.session.user = {
      id: user._id.toString(),
      phone: user.phone,
      fullName: user.fullName,
    };

    return res.json({ success: true, message: "Logged in successfully" });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
});

module.exports = router;
