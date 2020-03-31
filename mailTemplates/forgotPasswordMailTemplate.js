module.exports = ({ email, password_reset_link }) => {
    return {
        to: email,
        subject: 'Password Reset',
        // html: "",
        text: `You are receiving this because you have requested the reset of the password for your account.
          'Please follow the below url to complete the process: 
          ${password_reset_link}
          'If you did not request this, please ignore this email and your password will remain unchanged.`
    };
};