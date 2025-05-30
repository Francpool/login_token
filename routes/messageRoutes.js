const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Flat = require("../models/Flat");
const { verifyToken } = require("../middleware/auth");

// GET ALL messages for a flat - only flat owner
router.get("/flats/:id/messages", verifyToken, async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id);
    if (!flat) return res.status(404).json({ message: "Flat not found" });

    // Only owner can view all messages
    if (flat.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not the owner of this flat" });
    }

    const messages = await Message.find({ flat: req.params.id })
      .populate("sender", "firstname lastname email")
      .sort({ created: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET messages for a flat by sender - only the sender can access
router.get("/flats/:id/messages/:senderId", verifyToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.senderId) {
      return res.status(403).json({ message: "You are not allowed to view these messages" });
    }

    const messages = await Message.find({ flat: req.params.id, sender: req.params.senderId })
      .sort({ created: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new message to a flat
router.post("/flats/:id/messages", verifyToken, async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id);
    if (!flat) return res.status(404).json({ message: "Flat not found" });

    const message = new Message({
      content: req.body.content,
      flat: req.params.id,
      sender: req.user.id
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
