const { Schema, model } = require("mongoose");

const schema = new Schema({
  gameName: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  gameDescription: { type: String, required: true },
  releaseDate: { type: String, required: true },
  gameAddDate: { type: Date, required: true },
  isPhysical: { type: Boolean, required: true },
  isDigital: { type: Boolean, required: true },
  numberOfPhysicalCopies: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  imgSource: { type: Array, default: [] },
  plannedDiscount: { type: Number, default: 0 },
  plannedDiscountStartsOn: { type: Date },
  plannedDiscountEndsOn: { type: Date },
});

module.exports = model("Game", schema);
