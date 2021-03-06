const { Router } = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = Router();

// /api/auth/registration
router.post(
  "/registration",
  [
    check("username", "The minimum username length is 3 characters, the maximum is 15").isLength({ min: 3, max: 15 }),
    check("email", "Incorrect email").isEmail(),
    check("password", "The minimum password length is 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Error: Incorrect data during registration.",
        });
      }

      const { username, email, password } = req.body;

      const candidateByName = await User.findOne({ username })
      const candidateByEmail = await User.findOne({ email });

      if (candidateByName && Object.keys(candidateByName).length) {
        return res.status(400).json({
          message: "Error: User with such name already exist...",
        });
      }

      if (candidateByEmail) {
        return res.status(400).json({
          message: "Error: User with such email already exist...",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        dateOfRegistration: Date.now(),
      });

      await newUser.save();

      const token = jwt.sign({ userId: newUser.id }, config.get("jwtSecret"), {
        expiresIn: "2000",
      });

      res.status(201).json({
        message: "User created!",
        token,
        user: {
          id: newUser._id,
          name: newUser.username,
          email: newUser.email,
          dateOfRegistration: newUser.dateOfRegistration,
          isAdmin: newUser.isAdmin,
        },
      });
    } catch (e) {
      console.log(e)
      res.status(500).json({ message: "Something wrong, try again later..." });
    }
  }
);

// /api/auth/login
router.post(
  "/login",
  [check("email", "Enter the correct email").normalizeEmail().isEmail(), check("password", "Enter password").exists()],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return (
          res.
          status(400).json({
            errors: errors.array(),
            message: "Incorrect data during login.",
          })
        );
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "Error: User is not found." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Error: Wrong password. Try again..." });
      }

      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "1h",
      });

      res.json({
        token,
        userId: user.id,
        user: {
          id: user._id,
          name: user.username,
          email: user.email,
          dateOfRegistration: user.dateOfRegistration,
          isAdmin: user.isAdmin,
        },
      });
    } catch (e) {
      res.status(500).json({ message: "Something wrong, try again..." });
    }
  }
);

module.exports = router;
