const { Router } = require("express");
const User = require("../models/User");
const router = Router();

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ message: "Error: User not found" });
    }

    res.status(200).json(user);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const checkIsGameAlreadyExist = await User.findOne({ _id: req.params.id });
    checkIsGameAlreadyExist.gamesInTheBasket.forEach((obj) => {
      if (obj.gameName === req.body.gamesInTheBasket[req.body.gamesInTheBasket.length - 1].gameName) {
        return res.status(400).json({
          message: "Error: Such game already exists in the basket.",
        });
      }
    });
    res.status(200).json({ message: "Game added to basket" });
    await User.findByIdAndUpdate({ _id: req.params.id }, req.body);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

router.delete("/remove-game-from-basket/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate({ _id: req.params.id }, req.body);
    res.status(200).json({ message: "The game has been removed from the basket" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

router.put("/purchase-game/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate({ _id: req.params.id }, req.body);
    res.status(200).json({ message: "You have successfully purchased the game (s).", user: req.body });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

router.put("/update-user-data/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate({ _id: req.params.id }, req.body);
    res.status(200).json({ message: "User data updated successfully" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

module.exports = router;
