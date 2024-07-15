const express = require('express')
const router = express.Router()
const authController = require("../controllers/auth/user");

router.use(express.json())

//Get routes
router.get('/', (req, res) => {
    res.send('User endpoint')
})

//Post Routes

router.post('/signup', authController.register)
router.post('/login', authController.login)
module.exports = router