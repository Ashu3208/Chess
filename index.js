// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const games = {}
// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for the 'move' event from the client
  socket.on('move', ({ startPositionId, targetPositionId }) => {
    // Broadcast the move to all other connected clients
    socket.broadcast.emit('move', { startPositionId, targetPositionId });
  });
  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    // Implement any necessary cleanup or logic here.
  });
});

// Serve static files from the 'public' directory (adjust the path as needed)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html')); // Use path.join() to get the absolute path
  });

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
