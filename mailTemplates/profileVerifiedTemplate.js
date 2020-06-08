module.exports = ({ email }) => {
    return {
        to: email,
        subject: 'Your profile is verified',
        // html: "",
        text: `Hi there, your profile is verified.`
    };
};