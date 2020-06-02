module.exports = ({ send_to_email, sent_by_member_type, sent_by_name }) => {
    return {
        to: send_to_email,
        subject: 'Footplayer Request',
        // html: "",
        text: `${sent_by_name} ${sent_by_member_type} wants to add you on its network.`
    };
};