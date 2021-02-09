const { Schema, model } = require("mongoose");

const schema = new Schema({
  achievementTopic: { type: String, required: true },
  achievementName: { type: String, required: true, unique: true },
  achievementText: { type: String, required: true },
  achievementValue: { type: Number, required: true },
  estimatedDiscountForTheClient: { type: Number, required: true, default: 0 },
});

module.exports = model("Achievement", schema);