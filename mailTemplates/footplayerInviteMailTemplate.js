module.exports = ({ send_to_email, sent_by_member_type, sent_by_name, link}) => {
    return {
        to: send_to_email,
        subject: 'Footplayer Invitation',
        // html: "",
        text: `${sent_by_name} ${sent_by_member_type} wants to add you on its network. Please register yourself on YFTChain using this link: ${link} to become a member of ${sent_by_name} ${sent_by_member_type}.`
    };
};