const { Router } = require("express");
const User = require("../models/User");
const router = Router();

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
})

// router.post('/:id', async(req, res) => {
//     try {
//         const checkUser = await User.findById(req.params.id);
//         if(!checkUser) {
//             return res.status(400).json({ message: 'User not found' }); 
//         }

//         const { purchasedGames } = req.body;

//         res.status(200).json({ message: 'The game was successfully added to the list of purchased' })

//     } catch (e) {
//         return res.status(500).json({ message: e.message })
//     }

// })

module.exports = router;