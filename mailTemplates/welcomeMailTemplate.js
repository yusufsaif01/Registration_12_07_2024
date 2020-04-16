module.exports = ({ email }) => {
    return {
        to: email,
        subject: 'Welcome To YFTChain',
        // html: "",
        text: `Welcome to YFTChain.`
    };
};