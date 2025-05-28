const mongoose = require("mongoose");

const flatSchema = new mongoose.Schema({
  city:         { type: String, required: true },
  streetName:   { type: String, required: true },
  streetNumber: { type: String, required: true },
  areaSize:     { type: Number, required: true },    // metros cuadrados o pies
  hasAC:        { type: Boolean, default: false },
  yearBuilt:    { type: Number, required: true },
  rentPrice:    { type: Number, required: true },
  dateAvailable:{ type: Date, required: true },
  owner:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true }); // agrega createdAt y updatedAt

module.exports = mongoose.model("Flat", flatSchema);
