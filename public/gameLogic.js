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
        partyItem.textContent = `Party ID: ${partyId}`;
        partyItem.appendChild(joinButton);
        availablePartiesList.appendChild(partyItem);
    }
});

// Handle party creation
document.getElementById('createPartyButton').addEventListener('click', () => {
    socket.emit('createParty');
});

// When a party is created, hide the creation button
socket.on('partyCreated', ({ partyId }) => {
    document.getElementById('partyOptions').style.display = 'none';
    alert(`You created a party with ID: ${partyId}. Waiting for another player.`);
});

// When a party is joined by an opponent
socket.on('partyJoined', ({ opponentId }) => {
    alert(`You have been paired with opponent ${opponentId}. The game will begin!`);
});

// Handle the game start
socket.on('gameStart', () => {
    document.getElementById('partyOptions').style.display = 'none';
    document.getElementById('gameActions').style.display = 'block';
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
