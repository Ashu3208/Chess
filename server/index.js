const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
var cors = require('cors')
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
require('dotenv').config()
const dbConnection = require('./database/connection');
const gameRouter = require('./routes/gameRouter')
const userRouter = require('./routes/userRouter')
const games = {}

dbConnection()


//CORS configuration
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use('/',cors(corsOptions))

// Routes configuration
app.use('/game',gameRouter)
app.use('/user',userRouter)



io.on('connection', (socket) => {
  console.log('A user connected' , socket.id);

  socket.on('move', ({ startPositionId, targetPositionId }) => {
    socket.broadcast.emit('move', { startPositionId, targetPositionId });
  });
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});


// Start the server
const port = process.env.SERVER_PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
