const attackDefenseKey = {
    A: { attacks: ["DDoS", "Brute Force"], defenses: ["Load Balancing", "MFA"], room: "Main Server", points: 10 },
    B: { attacks: ["SQL Injection", "Data Breach"], defenses: ["Encryption", "Input Validation"], room: "Database", points: 8 },
    C: { attacks: ["Man-in-the-Middle", "Spoofing"], defenses: ["Packet Filtering", "Intrusion Detection"], room: "Router (Main Bedroom)", points: 7 },
    D: { attacks: ["Phishing", "Malware Injection"], defenses: ["MFA", "Email Filtering"], room: "Email Server", points: 6 },
    E: { attacks: ["Ransomware", "Data Destruction"], defenses: ["Regular Backups", "Encryption"], room: "Backup Server", points: 5 },
    F: { attacks: ["Brute Force", "Packet Sniffing"], defenses: ["MFA", "Packet Filtering"], room: "Access Control Systems (Bathrooms)", points: 2 },
    G: { attacks: ["Packet Sniffing", "Data Interception"], defenses: ["Packet Filtering", "Intrusion Detection"], room: "Network Segments/Hallways", points: 3 },
    H: { attacks: ["Information Leakage", "Backdoors"], defenses: ["Limited Access", "Logging"], room: "Low-Value Storage", points: 2 },
    I: { attacks: ["Credential Stuffing", "Spear Phishing"], defenses: ["MFA", "Strong Password Policies"], room: "Entry Points (Doors)", points: 3 }
};

function determineWinner() {
    let team1AttackPoints = 0;
    let team2AttackPoints = 0;
    let team1DefensePoints = 0;
    let team2DefensePoints = 0;

    let team1BrokenRooms = [];
    let team2BrokenRooms = [];
    let team1DefendedRooms = [];
    let team2DefendedRooms = [];

    // Team 1 Inputs
    let team1Attacks = [
        document.getElementById("team1Attack1").value,
        document.getElementById("team1Attack2").value,
        document.getElementById("team1Attack3").value
    ];
    let team1Defenses = [
        document.getElementById("team1Defense1").value,
        document.getElementById("team1Defense2").value,
        document.getElementById("team1Defense3").value
    ];

    // Team 2 Inputs
    let team2Attacks = [
        document.getElementById("team2Attack1").value,
        document.getElementById("team2Attack2").value,
        document.getElementById("team2Attack3").value
    ];
    let team2Defenses = [
        document.getElementById("team2Defense1").value,
        document.getElementById("team2Defense2").value,
        document.getElementById("team2Defense3").value
    ];

    // Logic to check attacks and defenses for each room
    Object.keys(attackDefenseKey).forEach(letter => {
        let room = attackDefenseKey[letter].room;
        let possibleAttacks = attackDefenseKey[letter].attacks;
        let possibleDefenses = attackDefenseKey[letter].defenses;
        let points = attackDefenseKey[letter].points;

        // Team 1 attacking Team 2 rooms
        let team1BrokeIn = false;
        team1Attacks.forEach(attack => {
            if (possibleAttacks.includes(attack) && !team2Defenses.some(defense => possibleDefenses.includes(defense))) {
                team1AttackPoints += points;
                team1BrokenRooms.push(room);
                team1BrokeIn = true;
            }
        });
        if (!team1BrokeIn) {
            team2DefensePoints += points;
            team2DefendedRooms.push(room);
        }

        // Team 2 attacking Team 1 rooms
        let team2BrokeIn = false;
        team2Attacks.forEach(attack => {
            if (possibleAttacks.includes(attack) && !team1Defenses.some(defense => possibleDefenses.includes(defense))) {
                team2AttackPoints += points;
                team2BrokenRooms.push(room);
                team2BrokeIn = true;
            }
        });
        if (!team2BrokeIn) {
            team1DefensePoints += points;
            team1DefendedRooms.push(room);
        }
    });

    // Display the results
    document.getElementById("team1Points").innerHTML = `Team 1 Attack Points: ${team1AttackPoints}, Defense Points: ${team1DefensePoints}`;
    document.getElementById("team2Points").innerHTML = `Team 2 Attack Points: ${team2AttackPoints}, Defense Points: ${team2DefensePoints}`;

    let winnerText = (team1AttackPoints + team1DefensePoints) > (team2AttackPoints + team2DefensePoints) ? "Team 1 Wins!" : 
                     (team1AttackPoints + team1DefensePoints) < (team2AttackPoints + team2DefensePoints) ? "Team 2 Wins!" : "It's a Draw!";
    document.getElementById("winner").innerHTML = "Winner: " + winnerText;

    // Display broken and defended rooms
    document.getElementById("team1BrokenRooms").innerHTML = "Team 1 broke into: " + (team1BrokenRooms.length ? team1BrokenRooms.join(', ') : "No rooms");
    document.getElementById("team1DefendedRooms").innerHTML = "Team 1 defended: " + (team1DefendedRooms.length ? team1DefendedRooms.join(', ') : "No rooms");

    document.getElementById("team2BrokenRooms").innerHTML = "Team 2 broke into: " + (team2BrokenRooms.length ? team2BrokenRooms.join(', ') : "No rooms");
    document.getElementById("team2DefendedRooms").innerHTML = "Team 2 defended: " + (team2DefendedRooms.length ? team2DefendedRooms.join(', ') : "No rooms");
}
