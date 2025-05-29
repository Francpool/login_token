// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth");

// Ruta para que el usuario vea su propia información
// routes/userRoutes.js

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ¡Devuelve todos los campos!
    res.json({
      _id: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      birthdate: user.birthdate,
      isAdmin: user.isAdmin,
      // otros campos si quieres...
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

// PUT /api/users/:id - Editar usuario (solo admin)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }
    const { id } = req.params;
    const { email, firstname, lastname, birthdate, isAdmin } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      {
        email,
        firstname,
        lastname,
        birthdate: new Date(birthdate),
        isAdmin: isAdmin === true || isAdmin === "true"
      },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User updated successfully", user });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({ message: "Email already in use" });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/users/:id - Eliminar usuario (solo admin)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
