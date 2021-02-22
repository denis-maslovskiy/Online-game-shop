const { Schema, model } = require("mongoose");

const schema = new Schema({
    authorName: { type: String, required: true, unique: true },
    authorDescription: { type: String, default: "No information" },
    authorsGames: { type: Array, default: [] },
    yearOfFoundationOfTheCompany: { type: Date, default: new Date() },
    authorLogo: { type: String, default: "" }
});

module.exports = model("GameAuthor", schema);
