const db = require('../db');
const PlayerSpecializationService = require('../services/PlayerSpecializationService');

var positionSeeder = () => {
    const positions = [
        {
            name: 'Goalkeeper', abbreviation: 'GK'
        },
        {
            name: 'Centre Back', abbreviation: 'CB'
        },
        {
            name: 'Left Back', abbreviation: 'LB'
        },
        {
            name: 'Right Back', abbreviation: 'RB'
        },
        {
            name: 'Left Midfielder', abbreviation: 'LM'
        },
        {
            name: 'Centre Midfielder', abbreviation: 'CM'
        },
        {
            name: 'Right Midfielder', abbreviation: 'RM'
        },
        {
            name: 'Centre Defensive Midfielder', abbreviation: 'CDM'
        },
        {
            name: 'Centre Attacking Midfielder', abbreviation: 'CAM'
        },
        {
            name: 'Left Wing', abbreviation: 'LW'
        },
        {
            name: 'Right Wing', abbreviation: 'RW'
        },
        {
            name: 'Striker', abbreviation: 'ST'
        }
    ];
    (async () => {
        try {
            await db.connectDB();
            const playerSpecializationInst = new PlayerSpecializationService();
            await playerSpecializationInst.addPositions(positions)
            console.log("#############DONE##############");
            process.exit();
        } catch (err) {
            console.log("#############ERROR##############", err);
            process.exit(err);
        }
    })();
}

positionSeeder();

