const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const { v4: uuidv4 } = require('uuid');
const router = require('./routes/router')
app.use('/game',router)

const games = {}

io.on('connection', (socket) => {
  console.log('A user connected' , socket.id);

  socket.on('move', ({ startPositionId, targetPositionId }) => {
    socket.broadcast.emit('move', { startPositionId, targetPositionId });
  });
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.use(express.static(path.join(__dirname,'../client/public')));
app.use('/game', express.static(path.join(__dirname, '../client/public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); 
  });

app.get('/game/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/index.html')); 
  });
  
// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
