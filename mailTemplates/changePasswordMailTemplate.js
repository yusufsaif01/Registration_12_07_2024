module.exports = ({ email }) => {
    return {
        to: email,
        subject: 'Password Changed',
        // html: "",
        text: `Your password has been changed.`
    };
};