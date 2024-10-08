const attackDefenseKey = {
    A: { attacks: ["DDoS", "Brute Force"], defenses: ["Load Balancing", "MFA"] },
    B: { attacks: ["SQL Injection", "Data Breach"], defenses: ["Encryption", "Input Validation"] },
    C: { attacks: ["Man-in-the-Middle", "Spoofing"], defenses: ["Packet Filtering", "Intrusion Detection"] },
    D: { attacks: ["Phishing", "Malware Injection"], defenses: ["MFA", "Email Filtering"] },
    E: { attacks: ["Ransomware", "Data Destruction"], defenses: ["Regular Backups", "Encryption"] },
    F: { attacks: ["Brute Force", "Packet Sniffing"], defenses: ["MFA", "Packet Filtering"] },
    G: { attacks: ["Packet Sniffing", "Data Interception"], defenses: ["Packet Filtering", "Intrusion Detection"] },
    H: { attacks: ["Information Leakage", "Backdoors"], defenses: ["Limited Access", "Logging"] },
    I: { attacks: ["Credential Stuffing", "Spear Phishing"], defenses: ["MFA", "Strong Password Policies"] }
};

function determineWinner() {
    let team1Points = 0;
    let team2Points = 0;

    // Team 1 Inputs (modify IDs to be correct)
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

    // Team 2 Inputs (modify IDs to be correct)
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

    // Simple logic to compare attacks and defenses
    for (let i = 0; i < 3; i++) {
        if (!team2Defenses.includes(team1Attacks[i])) {
            team1Points++;
        }
        if (!team1Defenses.includes(team2Attacks[i])) {
            team2Points++;
        }
    }

    // Display the results
    document.getElementById("team1Points").innerHTML = "Team 1 Points: " + team1Points;
    document.getElementById("team2Points").innerHTML = "Team 2 Points: " + team2Points;

    let winnerText = team1Points > team2Points ? "Team 1 Wins!" : team1Points < team2Points ? "Team 2 Wins!" : "It's a Draw!";
    document.getElementById("winner").innerHTML = "Winner: " + winnerText;
}
