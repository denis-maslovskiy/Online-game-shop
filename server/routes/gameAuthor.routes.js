const { Router } = require("express");
const GameAuthor = require("../models/GameAuthor");
const router = Router();

router.get("/get-all-game-authors", async (req, res) => {
  try {
    const authors = await GameAuthor.find();
    if (!authors) {
      return res.status(400).json({ message: "No game authors" });
    }

    res.status(200).json(authors);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/get-selected-game-author/:id", async (req, res) => {
  try {
    const author = await GameAuthor.findById(req.params.id);
    if (!author) {
      return res.status(400).json({ message: "Game author not found" });
    }

    res.status(200).json(author);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
