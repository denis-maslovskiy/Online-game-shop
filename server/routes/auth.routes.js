const {Router} = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');
const router = Router();

// /api/auth/registration
router.post(
    '/registration',
    [
        check('username', 'The minimum username length is 3 characters, the maximum is 15').isLength({ min: 6, max: 15 }),
        check('email', 'Incorrect email').isEmail(),
        check('password', 'The minimum password length is 6 characters').isLength({ min: 6})
    ], 
    async (req, res) => {
    try {
        const errors = validationResult(reg);

        if(!errors.isEmpty()) {
            return res,status(400).json({ errors: errors.array(), message: 'Incorrect data during registration' })
        }

        const {username, email, password} = req.body;

        const candidate = await User.findOne({username, email});

        if(candidate) {
            return res.status(400).json({ message: 'Such user already exist' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ username, email, password: hashedPassword });

        await user.save();

        res.status(201).json({ message: 'User created' });

    } catch (e) {
        res.status(500).json({ message: 'Something wrong, try again...' })
    }
})

// /api/auth/login
router.post(
    '/login', 
    [
        check('username', 'Enter username').exists(),
        check('email', 'Enter the correct email').normalizeEmail().isEmail(),
        check('password', 'Enter password').exists(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(reg);
    
            if(!errors.isEmpty()) {
                return res,status(400).json({ errors: errors.array(), message: 'Incorrect data during login' })
            }
    
            const {username, email, password} = req.body;

            const user = await User.findOne({ username, email });

            if(!user) {
                return res.status(400).json({ message: 'User is not found' })
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) {
                return res.status(400).json({ message: 'Wrong password. Try again...' })
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            );

            res.json({ token, userId: user.id });
    
        } catch (e) {
            res.status(500).json({ message: 'Something wrong, try again...' })
        }
})

module.exports = router;