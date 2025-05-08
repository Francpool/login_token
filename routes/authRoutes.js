const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");

router.post("/register", async (req, res) => {
  try {
    const exists = await User.findOne({ username: req.body.username });
    if (exists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({ ...req.body, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login del usuario
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        phone: user.phone,
        isAdmin: user.isAdmin
      },
      jwtSecret,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        phone: user.phone,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const { verifyToken } = require("../middleware/auth");

router.get("/profile", verifyToken, (req, res) => {
  res.json({ message: "Ruta protegida", user: req.user });
});

module.exports = router;
