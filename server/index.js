const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
require('dotenv').config()
const dbConnection = require('./database/connection');
const router = require('./routes/router')
const games = {}

app.use('/game',router)
app.use('/game', express.static(path.join(__dirname, '../client/public')))
app.use(express.static(path.join(__dirname,'../client/public')));
dbConnection()

io.on('connection', (socket) => {
  console.log('A user connected' , socket.id);

  socket.on('move', ({ startPositionId, targetPositionId }) => {
    socket.broadcast.emit('move', { startPositionId, targetPositionId });
  });
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); 
  });

app.get('/game/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/index.html')); 
  });
  
// Start the server
const port = process.env.SERVER_PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
