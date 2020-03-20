module.exports = ({ email, password }) => {
    return {
        to: email,
        subject: 'Password Reset',
        // html: "",
        text: `You are receiving this because you have requested the reset of the password for your account.
          'Please copy following password, or paste this into your forgot password page to complete the process: 
          ${password}
          'If you did not request this, please ignore this email and your password will remain unchanged.`
    };
};