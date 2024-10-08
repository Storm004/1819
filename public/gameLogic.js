const socket = io();

// Handle the team name submission
document.getElementById('teamForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const teamName = document.getElementById('teamName').value;
    socket.emit('enterGame', teamName);
});

// Receive party options after entering the game
socket.on('partyOptions', (parties) => {
    document.getElementById('teamForm').style.display = 'none';
    document.getElementById('partyOptions').style.display = 'block';

    const availablePartiesList = document.getElementById('availablePartiesList');
    availablePartiesList.innerHTML = '';

    for (const partyId in parties) {
        const partyItem = document.createElement('li');
        const joinButton = document.createElement('button');
        joinButton.textContent = 'Join Party';
        joinButton.onclick = () => socket.emit('joinParty', partyId);
        partyItem.textContent = `Party: ${partyId}`;
        partyItem.appendChild(joinButton);
        availablePartiesList.appendChild(partyItem);
    }
});

// Handle party creation
document.getElementById('createPartyButton').addEventListener('click', () => {
    const partyName = prompt('Enter your party name:');
    if (partyName) {
        socket.emit('createParty', { partyName });
    }
});

// When a party is created, hide the creation button
socket.on('partyCreated', ({ partyId, partyName }) => {
    document.getElementById('partyOptions').style.display = 'none';

    // Show a UI element, no alerts
    const partyMessage = document.getElementById('partyMessage');
    partyMessage.innerHTML = `Party "${partyName}" created. Waiting for an opponent to join...`;
    partyMessage.style.display = 'block';
});

// When a party is joined by an opponent
socket.on('partyJoined', ({ opponentId }) => {
    document.getElementById('partyMessage').style.display = 'none';
    document.getElementById('partyOptions').style.display = 'none';

    // Inform user in the UI, not with alerts
    const opponentMessage = document.getElementById('opponentMessage');
    opponentMessage.innerHTML = `Opponent "${opponentId}" has joined. Starting the game...`;
    opponentMessage.style.display = 'block';

    // After a few seconds, begin the game
    setTimeout(() => {
        opponentMessage.style.display = 'none';
        document.getElementById('gameActions').style.display = 'block';
    }, 3000); // Wait 3 seconds before starting
});

// Handle action submission
document.getElementById('submitActions').addEventListener('click', () => {
    const attack1 = document.getElementById('attack1').value;
    const defense1 = document.getElementById('defense1').value;
    const actions = { attacks: [attack1], defenses: [defense1] };
    socket.emit('submitActions', actions);
});

// Show game results
socket.on('gameResults', (results) => {
    document.getElementById('gameActions').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    document.getElementById('resultText').innerHTML = `Results:<br>Attacks: ${JSON.stringify(results.attacks)}<br>Defenses: ${JSON.stringify(results.defenses)}`;
});

// Handle opponent disconnection
socket.on('opponentLeft', () => {
    document.getElementById('gameActions').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    document.getElementById('resultText').innerHTML = 'Your opponent left the game. You win!';
});
