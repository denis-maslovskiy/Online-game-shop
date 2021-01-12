const { Router } = require("express");
const Game = require("../models/Game");
const router = Router();

router.get("/get-all-games", async (req, res) => {
  try {
    const games = await Game.find();
    if (!games) {
      return res.status(400).json({ message: "No games" });
    }

    res.status(200).json(games);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Get current game by id
router.get("/:id", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(400).json({ message: "Game not found" });
    }

    res.status(200).json(game);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    await Game.findOneAndUpdate({ _id: req.params.id }, req.body);
    res.status(200).json(req.body);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
