const { Schema, model } = require("mongoose");

const schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  purchasedGames: { type: Array },
  gamesInTheBasket: { type: Array },
  dateOfRegistration: { type: Date, required: true },
  achievements: {type: Array},
  personalDiscount: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false },
});

module.exports = model("User", schema);
