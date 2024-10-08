const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Store parties and active games
let parties = {};
let activeGames = {};

// Serve static files
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log(`A player connected: ${socket.id}`);

    // Handle when a player enters the game with their team name
    socket.on('enterGame', (teamName) => {
        console.log(`Player ${socket.id} entered with team name: ${teamName}`);
        socket.teamName = teamName;
        socket.emit('partyOptions', parties);
    });

    // Handle party creation
    socket.on('createParty', () => {
        const partyId = socket.id;
        if (!parties[partyId]) {
            parties[partyId] = {
                partyId,
                leader: socket.id,
                players: [socket.id],
            };
            console.log(`Party created: ${partyId}`);
            socket.emit('partyCreated', { partyId });
            io.emit('partyOptions', parties); // Update all clients about new parties
        }
    });

    // Handle joining a party
    socket.on('joinParty', (partyId) => {
        if (parties[partyId] && parties[partyId].players.length < 2) {
            parties[partyId].players.push(socket.id);
            console.log(`Player ${socket.id} joined party ${partyId}`);

            // Notify both players that the party is full and start the game
            const leaderSocket = parties[partyId].players[0];
            io.to(leaderSocket).emit('partyJoined', { opponentId: socket.id });
            io.to(socket.id).emit('partyJoined', { opponentId: leaderSocket });

            // Remove the party from the available parties list and start the game
            delete parties[partyId];
            activeGames[partyId] = { players: [leaderSocket, socket.id] };
            io.emit('partyOptions', parties); // Update all clients about updated parties
            io.to(leaderSocket).emit('gameStart');
            io.to(socket.id).emit('gameStart');
        } else {
            socket.emit('errorMessage', 'Party is full or no longer available.');
        }
    });

    // Handle action submissions (attacks/defenses)
    socket.on('submitActions', (actions) => {
        const game = Object.values(activeGames).find((game) =>
            game.players.includes(socket.id)
        );
        if (game) {
            game.actions = game.actions || {};
            game.actions[socket.id] = actions;

            // Once both players have submitted their actions, show results
            if (game.actions[game.players[0]] && game.actions[game.players[1]]) {
                const results = {
                    attacks: {
                        [game.players[0]]: game.actions[game.players[0]].attacks,
                        [game.players[1]]: game.actions[game.players[1]].attacks,
                    },
                    defenses: {
                        [game.players[0]]: game.actions[game.players[0]].defenses,
                        [game.players[1]]: game.actions[game.players[1]].defenses,
                    },
                };
                io.to(game.players[0]).emit('gameResults', results);
                io.to(game.players[1]).emit('gameResults', results);

                // Clean up after the game
                delete activeGames[game.players[0]];
            }
        }
    });

    // Handle player disconnection
    socket.on('disconnect', () => {
        console.log(`Player ${socket.id} disconnected`);

        // Remove the player from any party or game they are in
        for (const partyId in parties) {
            const party = parties[partyId];
            if (party.players.includes(socket.id)) {
                delete parties[partyId];
                io.emit('partyOptions', parties); // Update all clients about updated parties
                break;
            }
        }

        for (const gameId in activeGames) {
            const game = activeGames[gameId];
            if (game.players.includes(socket.id)) {
                const remainingPlayer = game.players.find((id) => id !== socket.id);
                io.to(remainingPlayer).emit('opponentLeft');
                delete activeGames[gameId];
                break;
            }
        }
    });
});

// Use the port provided by Heroku or default to 3000 for local development
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
