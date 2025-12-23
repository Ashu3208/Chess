const express = require('express')
const router = express.Router()
const authController = require("../controllers/auth/user");
const authMiddleware = require("../middleware/auth")

router.use(express.json())

//Get routes
router.get('/', (req, res) => {
    res.send('User endpoint')
})

//Post Routes

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/forgot-password', authController.forgotPassword)
router.get('/valid',authMiddleware,(req,res)=>res.send(req.user))
module.exports = router