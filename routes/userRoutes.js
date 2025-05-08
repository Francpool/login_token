// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth");

// Ruta para que el usuario vea su propia información
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      isAdmin: user.isAdmin
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para que el administrador vea a todos los usuarios
router.get("/all", verifyToken, async (req, res) => {
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

module.exports = router;
