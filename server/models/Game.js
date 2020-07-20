const { Schema, model } = require("mongoose");

const schema = new Schema({
  gameName: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  gameDescription: { type: String, required: true },
  releaseDate: { type: String, required: true },
  gameAddDate: { type: Date, required: true },
});

module.exports = model("Game", schema);
