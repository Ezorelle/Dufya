const express = require("express");

const router = express.Router();

// POST /api/logout
router.post("/", (req, res) => {
  if (!req.session) {
    return res.status(400).json({ success: false, message: "No active session" });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ success: false, message: "Logout failed" });
    }

    res.clearCookie("connect.sid", { path: "/" }); // clear session cookie
    return res.json({ success: true, message: "Logged out successfully" });
  });
});

module.exports = router;
