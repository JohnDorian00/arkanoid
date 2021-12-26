const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);

// my libs
const {Game} = require("./libs/Game");

// load static
app.use('/libs', express.static(__dirname + '/libs'));
// routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
});

let game = new Game(io);

io.on('connect', (socket) => {
    socket.on("newPlayer", (name) => {
        // register player and start game on client side
        if (name) {
            if (game.addPlayer(socket.id, name)) {
                console.log("New player registered, name:", name, ", id:", socket.id);
            }
        } else {
            console.error("Empty name\n");
        }
        socket.emit("startGame", game.getScreenParams());
    })

    socket.on("control", (key, value) => {
        game.playerChangeControls(socket.id, key, value)
    })

    socket.on('disconnect', () => {
        game.deletePlayer(socket.id)
        socket.removeAllListeners();
        console.log('disconnected', socket.id, "\n");
    });
});

// start server
server.listen(3000, () => {
    console.log('listening on *:3000');
});
