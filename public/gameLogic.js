const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

let waitingPlayers = [];
let activeGames = {};
const pointSystem = {
    A: 10, B: 8, C: 7, D: 6, E: 5, F: 2, G: 3, H: 2, I: 3
};

// Serve static files
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);

    socket.on('submitActions', ({ attacks, defenses }) => {
        const game = activeGames[socket.id];
        if (game) {
            game.attacks[socket.id] = attacks;
            game.defenses[socket.id] = defenses;

            if (Object.keys(game.attacks).length === 2 && Object.keys(game.defenses).length === 2) {
                const result = calculateResults(game);
                io.to(game.players[0]).emit('gameResults', result);
                io.to(game.players[1]).emit('gameResults', result);

                // Clean up after the game ends
                delete activeGames[game.id];
            }
        }
    });

    // More server logic (handling pairing, game setup, etc.)
});

// Function to calculate the game results
function calculateResults(game) {
    let yourPoints = 0;
    let opponentPoints = 0;

    // Example logic: compare attacks and defenses
    // Adjust as per your game rules

    // Declare the winner based on points
    const winner = yourPoints > opponentPoints ? 'You' : 'Opponent';
    return { attacks: game.attacks, defenses: game.defenses, yourPoints, opponentPoints, winner };
}

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
