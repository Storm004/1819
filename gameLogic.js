const attackDefenseKey = {
    A: { attacks: ["DDoS", "Brute Force"], defenses: ["Load Balancing", "MFA"], room: "Main Server" },
    B: { attacks: ["SQL Injection", "Data Breach"], defenses: ["Encryption", "Input Validation"], room: "Database" },
    C: { attacks: ["Man-in-the-Middle", "Spoofing"], defenses: ["Packet Filtering", "Intrusion Detection"], room: "Router (Main Bedroom)" },
    D: { attacks: ["Phishing", "Malware Injection"], defenses: ["MFA", "Email Filtering"], room: "Email Server" },
    E: { attacks: ["Ransomware", "Data Destruction"], defenses: ["Regular Backups", "Encryption"], room: "Backup Server" },
    F: { attacks: ["Brute Force", "Packet Sniffing"], defenses: ["MFA", "Packet Filtering"], room: "Access Control Systems (Bathrooms)" },
    G: { attacks: ["Packet Sniffing", "Data Interception"], defenses: ["Packet Filtering", "Intrusion Detection"], room: "Network Segments/Hallways" },
    H: { attacks: ["Information Leakage", "Backdoors"], defenses: ["Limited Access", "Logging"], room: "Low-Value Storage" },
    I: { attacks: ["Credential Stuffing", "Spear Phishing"], defenses: ["MFA", "Strong Password Policies"], room: "Entry Points (Doors)" }
};

function determineWinner() {
    let team1Points = 0;
    let team2Points = 0;
    let team1BrokenRooms = [];
    let team2BrokenRooms = [];

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

        // Team 1 attacking Team 2 rooms
        team1Attacks.forEach(attack => {
            if (possibleAttacks.includes(attack) && !team2Defenses.some(defense => possibleDefenses.includes(defense))) {
                team1Points++;
                team1BrokenRooms.push(room);
            }
        });

        // Team 2 attacking Team 1 rooms
        team2Attacks.forEach(attack => {
            if (possibleAttacks.includes(attack) && !team1Defenses.some(defense => possibleDefenses.includes(defense))) {
                team2Points++;
                team2BrokenRooms.push(room);
            }
        });
    });

    // Display the results
    document.getElementById("team1Points").innerHTML = "Team 1 Points: " + team1Points;
    document.getElementById("team2Points").innerHTML = "Team 2 Points: " + team2Points;

    let winnerText = team1Points > team2Points ? "Team 1 Wins!" : team1Points < team2Points ? "Team 2 Wins!" : "It's a Draw!";
    document.getElementById("winner").innerHTML = "Winner: " + winnerText;

    // Display broken rooms
    document.getElementById("team1BrokenRooms").innerHTML = "Team 1 broke into: " + (team1BrokenRooms.length ? team1BrokenRooms.join(', ') : "No rooms");
    document.getElementById("team2BrokenRooms").innerHTML = "Team 2 broke into: " + (team2BrokenRooms.length ? team2BrokenRooms.join(', ') : "No rooms");
}
