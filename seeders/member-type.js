const db = require('../db');
const MemberTypeService = require('../services/MemberTypeService');
const path = require('path');
let baseDir = path.resolve(__dirname);
global.__basedir = baseDir.split('\seeders')[0];

var memberTypeSeeder = () => {
    const memberTypes = [
        {
            category: 'Player', sub_category: 'Grassroot'
        },
        {
            category: 'Player', sub_category: 'Amateur'
        },
        {
            category: 'Player', sub_category: 'Professional'
        },
        {
            category: 'Club', sub_category: 'Residential'
        },
        {
            category: 'Club', sub_category: 'Non-Residential'
        },
        {
            category: 'Academy', sub_category: 'Residential'
        },
        {
            category: 'Academy', sub_category: 'Non-Residential'
        }
    ];
    (async () => {
        try {
            await db.connectDB();
            const memberTypeInst = new MemberTypeService();
            await memberTypeInst.addMemberTypes(memberTypes)
            console.log("#############DONE##############");
            process.exit();
        } catch (err) {
            console.log("#############ERROR##############", err);
            process.exit(err);
        }
    })();
}

memberTypeSeeder();

