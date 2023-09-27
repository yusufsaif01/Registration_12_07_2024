const ProfileStatus = require('../constants/ProfileStatus')

module.exports = ({ email, remarks }) => {
    return {
        to: email,
        subject: `Your profile is ${ProfileStatus.DISAPPROVED}`,
        // html: "",
        text: `Hi there, your profile is ${ProfileStatus.DISAPPROVED}. due to "${remarks}"`
    };
};