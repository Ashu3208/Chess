const { toFormData } = require('axios');
const express = require('express')
const router = express.Router()
const { v4: uuidv4} = require('uuid');
const start = Date.now()
const toGameId = new Map()
// Middleware
// const timeLog = (req, res, next) => {
//     console.log('Time: ', Date.now()-start, start)
//     next()
// }
router.use(express.json())
// router.use(timeLog)

router.get('/', (req, res) => {
    res.send('Game endpoint')
})
router.post('/getMap', (req,res)=>{
    console.log(toGameId)
    res.json(Object.fromEntries(toGameId))
})
router.get('/new', (req,res)=>{
    const newGameId = uuidv4(); // Generate a unique ID
    console.log('new Game Id ',newGameId)
    // games[newGameId] = { /* game state */ };
    // console.log('games',games)
    var joinGameId = generateJoinId(1,4)
    toGameId.set(joinGameId,newGameId)
    console.log(joinGameId)
    const url='/game/'+newGameId
    res.json({ newGameId: newGameId, joinGameId:joinGameId, roomUrl:url  });
})
router.post('/join', (req,res)=>{
    const gameId = req.body.joinId
    console.log(req.body , gameId, toGameId.get(gameId))
    var roomId = toGameId.get(gameId)
    if(toGameId.has(gameId))res.json({roomUrl:`/game/${roomId}`})
    else res.status(400).json({ error: 'Invalid gameId. Please check the ID and try again.' });
})
const chessWords = [
    'pawn', 'knight', 'bishop', 'rook', 'queen', 'king', 'check', 'mate', 'castle',
    'enpassant', 'stalemate', 'draw', 'gambit', 'fianchetto', 'blitz', 'fork', 'pin', 'skewer'
  ];
function generateJoinId(numberOfWords,numberOfDigits){
    let words=[]
    for (let i=0;i<numberOfWords;i++){
        words.push(chessWords[Math.floor(Math.random() * chessWords.length)])
        const lower=Math.pow(10,numberOfDigits-1)
        const number = Math.floor(lower+Math.random()*9*(lower-1))
        words.push(number)
    }
    let newJoinID = words.join('')
    if(toGameId.has(newJoinID))return generateJoinId(numberOfWords+1,numberOfDigits*2)
    return newJoinID
}
module.exports = router