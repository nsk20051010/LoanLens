const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "loanlens_secret_key";

// -------------------- REGISTER --------------------
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ error: "All fields required" });

    const exists = await User.findOne({ username });
    if (exists)
      return res.status(400).json({ error: "Username already exists" });

    const user = new User({ username, password });
    await user.save();

    // Send token (frontend will *not* auto login)
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------- LOGIN --------------------
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user)
      return res.status(400).json({ error: "Invalid username or password" });

    const match = await user.matchPassword(password);
    if (!match)
      return res.status(400).json({ error: "Invalid username or password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
