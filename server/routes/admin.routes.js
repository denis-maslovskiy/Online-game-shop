const { Router } = require("express");
const Game = require("../models/Game");
const User = require("../models/User");
const router = Router();

router.use(async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    user.isAdmin
      ? next()
      : res.status(400).json({ message: "Access is blocked. Functionality are available only to the admin!" });
  } catch (e) {
    res.status(500).json({ message: "Something wrong, try again later..." });
  }
});

// /api/admin/create-game
router.post("/create-game", async (req, res) => {
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
      numberOfPhysicalCopies,
      discount,
    } = req.body;

    const isGameExist = await Game.findOne({ gameName });

    if (isGameExist) {
      return res.status(400).json({ message: "Game with this name already exist." });
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
      numberOfPhysicalCopies,
      discount,
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
        numberOfPhysicalCopies: newGame.numberOfPhysicalCopies,
        discount: newGame.discount,
      },
    });
  } catch (e) {
    res.status(500).json({ message: "Something wrong, try again later..." });
  }
});

router.put("/:id", async (req, res) => {
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
      numberOfPhysicalCopies,
      discount,
    } = req.body;
    await Game.findOneAndUpdate(
      { _id: req.params.id },
      {
        gameName,
        author,
        genre,
        price,
        rating,
        gameDescription,
        releaseDate,
        isPhysical,
        isDigital,
        numberOfPhysicalCopies,
        discount,
      }
    );
    res.status(200).json(req.body);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Game.remove({ _id: req.params.id });
    res.status(200).json({ message: "Game was deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
