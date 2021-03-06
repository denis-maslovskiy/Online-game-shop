const { Router } = require("express");
const cloudinary = require("cloudinary").v2;
const config = require("config");
const Game = require("../models/Game");
const User = require("../models/User");
const GameAuthor = require("../models/GameAuthor");
const Achievement = require("../models/Achievement");
const router = Router();
cloudinary.config({
  cloud_name: config.get("cloud_name"),
  api_key: config.get("api_key"),
  api_secret: config.get("api_secret"),
});

router.use(async (req, res, next) => {
  try {
    const userId = req.body.userId || req.query.userId;
    const user = await User.findById(userId);
    user.isAdmin
      ? next()
      : res.status(400).json({ message: "Error: Access is blocked. Functionality are available only to the admin!" });
  } catch (e) {
    res.status(500).json({ message: "Error: Something wrong, try again later..." });
  }
});

// Games
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
      return res.status(400).json({ message: "Error: Game with this name already exist." });
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
      plannedDiscount: 0,
      imgSource: [],
    });
    await newGame.save();

    res.status(201).json({
      message: "Game has been added successfully",
      game: {
        id: newGame._id,
        gameName: newGame.gameName,
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
        plannedDiscount: newGame.plannedDiscount,
        imgSource: newGame.imgSource,
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
      imgSource,
      plannedDiscount,
      plannedDiscountStartsOn,
      plannedDiscountEndsOn,
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
        imgSource,
        plannedDiscount,
        plannedDiscountStartsOn,
        plannedDiscountEndsOn,
      }
    );
    res.status(200).json({ message: "Game(s) has been edited successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Game.remove({ _id: req.params.id });
    res.status(200).json({ message: "Game has been deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/upload-image", async (req, res) => {
  try {
    const { fileStr } = req.body;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "lqxfbwbj",
    });
    res.status(200).json({ message: "Image uploaded", uploadResponse });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Users
router.get("/get-all-users", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(400).json({ message: "No users" });
    }

    res.status(200).json(users);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

// Achievements
router.post("/create-achievement", async (req, res) => {
  try {
    const {
      achievementTopic,
      achievementName,
      achievementText,
      achievementValue,
      estimatedDiscountForTheClient,
    } = req.body;

    const isAchievementExist = await Achievement.findOne({ achievementName });

    if (isAchievementExist) {
      return res.status(400).json({ message: "Error: Achievement with this name already exist." });
    }

    const newAchievement = new Achievement({
      achievementTopic,
      achievementName,
      achievementText,
      achievementValue,
      estimatedDiscountForTheClient,
    });
    await newAchievement.save();

    res.status(201).json({
      message: "Achievement has been added successfully",
      achievement: {
        id: newAchievement._id,
        achievementTopic: newAchievement.achievementTopic,
        achievementName: newAchievement.achievementName,
        achievementText: newAchievement.achievementText,
        achievementValue: newAchievement.achievementValue,
        estimatedDiscountForTheClient: newAchievement.estimatedDiscountForTheClient,
      },
    });
  } catch (e) {
    res.status(500).json({ message: "Something wrong, try again later..." });
  }
});

router.put("/edit-achievement/:id", async (req, res) => {
  try {
    const {
      achievementTopic,
      achievementName,
      achievementText,
      achievementValue,
      estimatedDiscountForTheClient,
    } = req.body;
    await Achievement.findOneAndUpdate(
      { _id: req.params.id },
      {
        achievementTopic,
        achievementName,
        achievementText,
        achievementValue,
        estimatedDiscountForTheClient,
      }
    );
    res.status(200).json({ message: "Achievement has been edited successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete("/delete-achievement/:id", async (req, res) => {
  try {
    await Achievement.remove({ _id: req.params.id });
    res.status(200).json({ message: "Achievement has been deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Game Author
router.post("/create-game-author", async (req, res) => {
  try {
    const { authorName, authorDescription, authorsGames, yearOfFoundationOfTheCompany } = req.body;

    const isAuthorExist = await GameAuthor.findOne({ authorName });

    if (isAuthorExist) {
      return res.status(400).json({ message: "Error: Author with this name already exist." });
    }

    const newGameAuthor = new GameAuthor({
      authorName,
      authorDescription,
      authorsGames,
      yearOfFoundationOfTheCompany,
    });
    await newGameAuthor.save();

    res.status(201).json({ message: "Author has been added successfully" });
  } catch (e) {
    res.status(500).json({ message: "Something wrong, try again later..." });
  }
});

router.put("/edit-game-author-info/:id", async (req, res) => {
  try {
    const { authorName, authorDescription, authorsGames, yearOfFoundationOfTheCompany, authorLogo } = req.body;
    await GameAuthor.findOneAndUpdate(
      { _id: req.params.id },
      {
        authorName,
        authorDescription,
        authorsGames,
        yearOfFoundationOfTheCompany,
        authorLogo,
      }
    );
    res.status(200).json({ message: "Author info has been edited successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete("/delete-game-author/:id", async (req, res) => {
  try {
    await GameAuthor.remove({ _id: req.params.id });
    res.status(200).json({ message: "Game author has been deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
