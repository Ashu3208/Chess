const express = require('express')
const router = express.Router()
const { v4: uuidv4} = require('uuid');

router.use(express.json())

//Get routes
router.get('/', (req, res) => {
    res.send('User endpoint')
})

//Post Routes

router.post('/signup', (req,res)=>{
    console.log(req.body)
    res.status(200)
})
module.exports = router