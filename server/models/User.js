const { Schema, model } = require("mongoose");

const schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  purchasedGames: { type: Array },
  dateOfRegistration: { type: Date, required: true },
});

module.exports = model("User", schema);
