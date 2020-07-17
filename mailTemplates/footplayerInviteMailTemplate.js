module.exports = ({
  send_to_email,
  send_to_name,
  sent_by_member_type,
  sent_by_name,
  link,
}) => {
  send_to_name = send_to_name || "User";
  return {
    to: send_to_email,
    subject: "Footplayer Invitation",
    // html: "",
    text: `${sent_by_name} ${sent_by_member_type} wants to add you on its network. Please register yourself on YFTChain using this link: ${link} to become a member of ${sent_by_name} ${sent_by_member_type}.`,

    html() {
      return `
        <tbody style="display: block;width: 80%; margin:auto;">
			<tr style="height: 20px;">
				<td></td>
			</tr>
			<!-- Heading of template -->
			<tr style="display:block; width: 100%;text-align: center;">
				<td style="display:block; width: 100%; text-align: center;">
					<h1 style="font-family: 'Paytone One', sans-serif;
					font-size: 48px;font-weight: 700;color:#626262">
						Dear ${send_to_name},</h1>
				</td>
			</tr>
			<!--  -->

			<!-- paragraph -->
			<tr style="height: 20px;">
				<td></td>
			</tr>
			<tr style="display:block; width: 100%;text-align: center;">
				<td style="display:block; width: 100%; text-align: center;">
					<p style="font-family: 'Montserrat', sans-serif;
					font-size: 16px;font-weight: 300;color:#626262;
					">
                        ${sent_by_name} wants to add you to their list of FootPlayers on the
                        <br> YFTChain portal. We request you to kindly click on the link provided below in order to
                        <br> complete your registration process on the portal.
					</p>
				</td>
			</tr>
			<tr style="height: 10px;">
				<td></td>
			</tr>
			

			<tr style="height: 20px;">
				<td></td>
			</tr>

			<tr style="display:block; width: 100%;text-align: center;">
				<td style=" display:block; width: 100%; text-align: center;">
					<a href="${link}" style="background: #FF9933;display: inline-block; border:none; color: #fff;font-family: 'Montserrat',
						sans-serif;font-size: 18px;border-radius: 10px;text-decoration:none;padding: 15px 40px;">Register On YFTChain portal.
					</a>
				</td>
			</tr>

			<tr style="height: 40px;">
				<td></td>
			</tr>
			<tr style="height: 40px;">
				<td style="display:block; width: 100%; text-align: center;">
					<p style="font-family: 'Montserrat', sans-serif;
					font-size: 16px;font-weight: 300;color:#626262;
					">
                        Once you have successfully completed the registration process and then verified your identity,
                        <br> you will be added as a FootPlayer with ${sent_by_name} and will witness a whole set of features especially unlocked for you.
                        We're very excited to see you become a part of the YFTChain community.
					</p>
				</td>
            </tr>
            
            <tr style="height: 40px;">
				<td></td>
            </tr>

			<!-- See you online -->

			<tr style="display:block; width: 100%;text-align: center;">
				<td style=" display:block; width: 100%; text-align: center;">
					<p style="font-family: 'Montserrat', sans-serif;
					font-size: 18px;font-weight: 300;color:#626262;
					">
						See you online!
					</p>
					<p style="font-family: 'Montserrat', sans-serif;
					font-size: 20px; font-weight: 700;display:block;color:#626262;
					">YFTChain Team</p>
				</td>
			</tr>
			<tr style=" height: 20px;">
				<td></td>
			</tr>
			<!-- end  -->
		</tbody>
      `;
    },
  };
};
