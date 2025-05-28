const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email:      { type: String, required: true, unique: true },
    password:   { type: String, required: true },
    firstname:  { type: String, required: true },
    lastname:   { type: String, required: true },
    birthdate:  { type: Date,   required: true },           // birth date
    isAdmin:    { type: Boolean, default: false },
    favouriteFlats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Flat" }], // array of references
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("User", userSchema);
