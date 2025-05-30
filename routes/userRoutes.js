const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");
const { verifyToken } = require("../middleware/auth");

// ========== REGISTER ==========
router.post("/users/register", async (req, res) => {
  try {
    const exists = await User.findOne({ email: req.body.email });
    if (exists) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      birthdate: new Date(req.body.birthdate),
      // otros campos opcionales
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({ message: "Email already in use" });
    }
    res.status(500).json({ error: err.message });
  }
});

// ========== LOGIN ==========
router.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        isAdmin: user.isAdmin
      },
      jwtSecret,
      { expiresIn: "1h" }
    );
    res.json({
      token,
      user: {
        _id: user._id,  
        firstname: user.firstname,
        lastname: user.lastname,
        isAdmin: user.isAdmin,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== GET ALL USERS (admin only) ==========
router.get("/users", verifyToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== GET USER BY ID (admin or self) ==========
router.get("/users/:id", verifyToken, async (req, res) => {
  try {
    if (!req.user.isAdmin && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      _id: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      birthdate: user.birthdate,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== PATCH USER (admin or self) ==========
router.patch("/users", verifyToken, async (req, res) => {
  try {
    const { id, ...update } = req.body;
    if (!req.user.isAdmin && req.user.id !== id) {
      return res.status(403).json({ message: "Access denied" });
    }
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }
    const user = await User.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully", user });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({ message: "Email already in use" });
    }
    res.status(500).json({ error: err.message });
  }
});

// ========== DELETE USER (admin or self) ==========
router.delete("/users/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params; // <-- el id viene de la URL, no del body
    if (!req.user.isAdmin && req.user.id !== id) {
      return res.status(403).json({ message: "Access denied" });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
