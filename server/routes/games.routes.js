const { Router } = require("express");
const Game = require("../models/Game");
const router = Router();

// /api/games/createOrUpdateGame
router.post("/createOrUpdateGame", async (req, res) => {
  try {
    const {
      gameName,
      author,
      genre,
      price,
      rating,
      gameDescription,
      releaseDate,
      isPhysical,
      isDigital,
      numberOfPhysicalCopies
    } = req.body;

    const isGameExist = await Game.findOne({ gameName });

    if (isGameExist) {
      return res
        .status(400)
        .json({ message: "Game with this name already exist." });
    }

    const newGame = new Game({
      gameName,
      author,
      genre,
      price,
      rating,
      gameDescription,
      releaseDate,
      gameAddDate: Date.now(),
      isPhysical,
      isDigital,
      numberOfPhysicalCopies
    });
    await newGame.save();

    res.status(201).json({
      message: "Game added",
      game: {
        id: newGame._id,
        name: newGame.gameName,
        author: newGame.author,
        genre: newGame.genre,
        price: newGame.price,
        rating: newGame.rating,
        gameDescription: newGame.gameDescription,
        releaseDate: newGame.releaseDate,
        gameAddDate: newGame.gameAddDate,
        isPhysical: newGame.isPhysical,
        isDigital: newGame.isDigital,
        numberOfPhysicalCopies: newGame.numberOfPhysicalCopies
      },
    });
  } catch (e) {
    res.status(500).json({ message: "Something wrong, try again later..." });
  }
});

router.get("/getAllGames", async (req, res) => {
    try {
        const games = await Game.find();
        if(!games) {
            return res.status(400).json({ message: 'No games' });
        }

        res.status(200).json(games);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// Get current game by id
router.get('/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if(!game) {
            return res.status(400).json({ message: 'Game not found' });
        }

        res.status(200).json(game);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
})

router.put('/:id', async (req,res) => {
  try {
    await Game.findOneAndUpdate({ _id: req.params.id }, req.body);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Game.remove({ _id: req.params.id })
    res.status(200).json({ message: "Game was deleted" })
  } catch (e) { 
    res.status(500).json({ message: e.message })
  }
})

module.exports = router;
