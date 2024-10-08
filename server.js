const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let parties = {}; // Store all available parties

// Serve static files from the "public" directory
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A player connected:', socket.id);

    // Handle when a player joins the lobby
    socket.on('enterGame', (teamName) => {
        socket.teamName = teamName;
        socket.emit('partyOptions', parties);
    });

    // Create a new party
    socket.on('createParty', () => {
        const partyId = socket.id;
        parties[partyId] = {
            players: [socket],
            partyId: partyId
        };
        socket.emit('partyCreated', { partyId });
        io.emit('partyOptions', parties); // Update the available parties for everyone
    });

    // Join an existing party
    socket.on('joinParty', (partyId) => {
        const party = parties[partyId];
        if (party.players.length < 2) {
            party.players.push(socket);
            io.to(party.players[0].id).emit('partyJoined', { opponentId: socket.id });
            socket.emit('partyJoined', { opponentId: party.players[0].id });

            // Start the game when two players are in the same party
            io.to(party.players[0].id).emit('gameStart');
            io.to(party.players[1].id).emit('gameStart');
        }
    });

    // Handle when a player submits their actions
    socket.on('submitActions', ({ partyId, actions }) => {
        const party = parties[partyId];
        const playerIndex = party.players.indexOf(socket);
        if (playerIndex !== -1) {
            party.actions = party.actions || {};
            party.actions[playerIndex] = actions;

            // When both players submit, emit the results
            if (party.actions[0] && party.actions[1]) {
                io.to(party.players[0].id).emit('gameResults', party.actions);
                io.to(party.players[1].id).emit('gameResults', party.actions);
                delete parties[partyId]; // Remove party after the game ends
            }
        }
    });

    // Handle player disconnection
    socket.on('disconnect', () => {
        console.log('A player disconnected:', socket.id);
        Object.keys(parties).forEach((partyId) => {
            const party = parties[partyId];
            if (party.players.includes(socket)) {
                party.players = party.players.filter((player) => player !== socket);
                if (party.players.length === 0) {
                    delete parties[partyId];
                } else {
                    io.to(party.players[0].id).emit('opponentLeft');
                }
            }
        });
    });
});

// Start the server on port 3000 (or the port provided by Heroku)
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
