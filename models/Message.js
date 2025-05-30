const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  flat: { type: mongoose.Schema.Types.ObjectId, ref: "Flat", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", messageSchema);
