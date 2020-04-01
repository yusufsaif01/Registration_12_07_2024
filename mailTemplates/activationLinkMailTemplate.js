module.exports = ({ email, activation_link }) => {
    return {
        to: email,
        subject: 'Email Verification',
        // html: "",
        text: `Welcome to YFTChain.
          'Please follow the below url for verifying your email: 
          ${activation_link}
          'If you did not request this, please ignore this email.`
    };
};