const { Router } = require("express");
const Achievement = require("../models/Achievement");
const router = Router();

router.get("/get-all-achievements", async (req, res) => {
  try {
    const achievements = await Achievement.find();
    if (!achievements) {
      return res.status(400).json({ message: "No achievements" });
    }

    res.status(200).json(achievements);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
