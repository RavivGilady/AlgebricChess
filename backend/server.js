const Game = require('./Game/game');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { connectDb } = require('./config/db');
const { Server } = require("socket.io");
const BotPlayer = require('./players/BotPlayer');
const HumanPlayer = require('./players/HumanPlayer');
const io = new Server(server);
const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/auth')
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.json());

app.use('/auth',authRoutes)


io.on('connection', (socket) => {
  console.log('a user connected, game is starting');
  isWhite = Math.random() > 0 ? true : false
  console.log(`isWhite? ${isWhite}`)
  const bot = new BotPlayer(1320)
  const human = new HumanPlayer(socket)
  const game = isWhite? new Game(human,bot) : new Game(bot,human)
  game.startGame();

  socket.on('disconnect', () => {
    console.log('user disconnected');
    //add resign 
  });

});


server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

connectDb()
    .then(() => console.log('Database connected successfully'))
    .catch(err => {
        console.error('Database connection failed:', err);
        process.exit(1);
    });