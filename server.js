const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let waitingPlayers = [];
let activeGames = {};

// Serve static files (like an index.html) from the "public" directory
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A player connected:', socket.id);

    // When a player joins the game lobby
    socket.on('joinGame', () => {
        if (waitingPlayers.length > 0) {
            // Pair the player with the one in the waiting list
            let opponentSocketId = waitingPlayers.pop();
            let gameId = socket.id + '_' + opponentSocketId;

            activeGames[gameId] = {
                players: [socket.id, opponentSocketId],
                ready: [false, false],
                attacks: {},
                defenses: {},
            };

            // Notify both players they've been paired
            io.to(socket.id).emit('paired', { opponentId: opponentSocketId, gameId });
            io.to(opponentSocketId).emit('paired', { opponentId: socket.id, gameId });
        } else {
            // No waiting players, add this player to the waiting list
            waitingPlayers.push(socket.id);
            socket.emit('waitingForOpponent');
        }
    });

    // When a player submits attacks and defenses
    socket.on('submitActions', ({ gameId, actions }) => {
        let game = activeGames[gameId];
        if (!game) return;

        let playerIndex = game.players.indexOf(socket.id);
        game.attacks[socket.id] = actions.attacks;
        game.defenses[socket.id] = actions.defenses;
        game.ready[playerIndex] = true;

        // Check if both players submitted actions
        if (game.ready[0] && game.ready[1]) {
            // Send results back to both players
            io.to(game.players[0]).emit('gameResults', { attacks: game.attacks, defenses: game.defenses });
            io.to(game.players[1]).emit('gameResults', { attacks: game.attacks, defenses: game.defenses });

            // Clean up the game after it's done
            delete activeGames[gameId];
        }
    });

    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('A player disconnected:', socket.id);

        // Remove from waiting players if they were waiting
        waitingPlayers = waitingPlayers.filter((id) => id !== socket.id);

        // Remove any active game they were in
        Object.keys(activeGames).forEach((gameId) => {
            let game = activeGames[gameId];
            if (game.players.includes(socket.id)) {
                let opponentId = game.players.find((id) => id !== socket.id);
                io.to(opponentId).emit('opponentLeft');
                delete activeGames[gameId];
            }
        });
    });
});

// Start the server on port 3000
// Use the port provided by Heroku or default to 3000 for local development
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

