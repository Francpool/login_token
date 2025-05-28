const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    console.log('Register received:', req.body); // 👈 Esto imprime el body recibido
    const exists = await User.findOne({ email: req.body.email });
    if (exists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Construye el nuevo usuario solo con los campos permitidos
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      birthdate: new Date(req.body.birthdate),
      // isAdmin y favouriteFlats quedan opcionales
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    // 👇 AGREGA ESTE CONSOLE.ERROR DENTRO DEL CATCH
    console.error("Register error:", err); // Esto imprime el error real en tu consola de Node

    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({ message: "Email already in use" });
    }
    res.status(500).json({ error: err.message });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

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

const { verifyToken } = require("../middleware/auth");

router.get("/profile", verifyToken, (req, res) => {
  res.json({ message: "Protected route", user: req.user });
});

module.exports = router;
