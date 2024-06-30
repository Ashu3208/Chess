// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const games = {}

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('move', ({ startPositionId, targetPositionId }) => {
    socket.broadcast.emit('move', { startPositionId, targetPositionId });
  });
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.use(express.static(path.join(__dirname,'/public')));
app.use('/game', express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); 
  });

app.post('/new-game', (req, res) => {
    const newGameId = `${Date.now()}`; // Generate a unique ID
    games[newGameId] = { /* game state */ };
    console.log(games)
    res.json({ gameId: newGameId });
});

app.get('/game/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html')); 
  });
  
// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
