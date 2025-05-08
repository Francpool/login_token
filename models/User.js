const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  firstname: String,
  lastname: String,
  phone: String,
  isAdmin: { type: Boolean, default: false },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
