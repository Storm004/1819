const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let waitingPlayers = [];
let parties = {};

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A player connected:', socket.id);

    let teamName = '';

    // Handle team entering game
    socket.on('enterGame', (name) => {
        teamName = name;
        socket.emit('partyOptions', parties); // Send current parties list
    });

    // Create party
    socket.on('createParty', () => {
        const partyId = socket.id;
        parties[partyId] = { teamName, players: [socket.id] };
        socket.emit('partyCreated', { partyId });
        io.emit('partyOptions', parties); // Update all players about available parties
    });

    // Join party
    socket.on('joinParty', (partyId) => {
        const party = parties[partyId];
        if (party && party.players.length === 1) {
            party.players.push(socket.id);
            io.to(party.players[0]).emit('partyJoined', { opponentId: socket.id });
            io.to(party.players[1]).emit('partyJoined', { opponentId: party.players[0] });

            delete parties[partyId]; // Remove party after it's filled
        }
    });

    socket.on('disconnect', () => {
        console.log('A player disconnected:', socket.id);

        // Clean up if player was part of a party
        for (const partyId in parties) {
            const party = parties[partyId];
            if (party.players.includes(socket.id)) {
                delete parties[partyId]; // Remove party if player disconnects
                io.emit('partyOptions', parties); // Update parties for all
                break;
            }
        }
    });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
