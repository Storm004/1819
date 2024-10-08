const socket = io();
let playerTeamName = '';

document.getElementById('teamForm').addEventListener('submit', (event) => {
    event.preventDefault();
    playerTeamName = document.getElementById('teamName').value;

    // Move to the next page (party creation/joining)
    document.getElementById('page1').style.display = 'none';
    document.getElementById('page2').style.display = 'block';

    socket.emit('joinGame', { teamName: playerTeamName });
});

// When the "Create Party" button is clicked
document.getElementById('createPartyButton').addEventListener('click', () => {
    socket.emit('createParty', { teamName: playerTeamName });
});

// Listening for available parties from the server
socket.on('updatePartyList', (parties) => {
    const partyList = document.getElementById('partyList');
    partyList.innerHTML = '';

    parties.forEach(party => {
        const partyItem = document.createElement('li');
        partyItem.innerHTML = `<button onclick="joinParty('${party.id}')">Join Party: ${party.name}</button>`;
        partyList.appendChild(partyItem);
    });
});

// Join a party
function joinParty(partyId) {
    socket.emit('joinParty', { partyId });
}

// Move to game page when paired with an opponent
socket.on('paired', ({ opponentId, gameId }) => {
    alert(`Paired with opponent ${opponentId}. Game ID: ${gameId}`);

    document.getElementById('page2').style.display = 'none';
    document.getElementById('page3').style.display = 'block';
});

// Submit game actions
document.getElementById('submitActions').addEventListener('click', () => {
    const attack1 = document.getElementById('attack1').value;
    const defense1 = document.getElementById('defense1').value;

    socket.emit('submitActions', {
        actions: {
            attacks: [attack1],
            defenses: [defense1]
        }
    });
});

// Show game results
socket.on('gameResults', ({ attacks, defenses }) => {
    document.getElementById('resultText').innerHTML = `Attacks: ${JSON.stringify(attacks)}<br>Defenses: ${JSON.stringify(defenses)}`;
    document.getElementById('results').style.display = 'block';
});
