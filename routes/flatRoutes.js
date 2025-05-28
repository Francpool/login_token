const express = require("express");
const router = express.Router();
const Flat = require("../models/Flat");
const { verifyToken } = require("../middleware/auth");

// GET /api/flats - Get all flats
router.get("/", async (req, res) => {
  try {
    const flats = await Flat.find().populate("owner", "firstname lastname email");
    res.json(flats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/flats/:id - Get flat by id
router.get("/:id", async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id).populate("owner", "firstname lastname email");
    if (!flat) return res.status(404).json({ message: "Flat not found" });
    res.json(flat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/flats - Add flat (only owner, must be logged in)
router.post("/", verifyToken, async (req, res) => {
  try {
    const flat = new Flat({
      ...req.body,
      owner: req.user.id
    });
    await flat.save();
    res.status(201).json(flat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/flats/:id - Update flat (only flat owner)
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id);
    if (!flat) return res.status(404).json({ message: "Flat not found" });
    if (flat.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not the owner of this flat" });
    }
    Object.assign(flat, req.body);
    await flat.save();
    res.json(flat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/flats/:id - Delete flat (only flat owner)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id);
    if (!flat) return res.status(404).json({ message: "Flat not found" });
    if (flat.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not the owner of this flat" });
    }
    await flat.deleteOne();
    res.json({ message: "Flat deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
