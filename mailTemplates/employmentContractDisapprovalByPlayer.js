module.exports = ({ email, name, reason, from, category }) => {
  return {
    to: email,
    subject: "Contract not approved",
    // html: "",
    text: `Employment Contract for ${name} has been disapproved due to ${reason} reason, Please update again.`,

    html(data) {
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
						Dear ${name.charAt(0).toUpperCase() + name.slice(1)},</h1>
				</td>
				<td style="display:block; width: 100%; text-align: center;">
					<h1 style="font-family: 'Paytone One', sans-serif;
					font-size: 48px;font-weight: 700;color:#626262">
						Sorry, looks like your contract</h1>
				</td>
				<td style="display:block; width: 100%; text-align: center;">
					<h1 style="font-family: 'Paytone One', sans-serif;
					font-size: 48px;font-weight: 700;color:#626262">
						needs to be updated</h1>
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
						We apologise to inform you that ${from.charAt(0).toUpperCase() + from.slice(1)} has not approved the contract information uploaded by your organisation due to ${reason}.</p>
				</td>
			</tr>
			<tr style="height: 10px;">
				<td></td>
			</tr>
			<tr style="display:block; width: 100%;text-align: center;">
				<td style="display:block; width: 100%; text-align: center;">
					<p style="font-family: 'Montserrat', sans-serif;
					font-size: 16px;font-weight: 300;color:#626262;
					">
						Please click below to go to the YFTChain's portal and add/update the contract information.</p>
				</td>
			</tr>
			<tr style="height: 40px;">
				<td></td>
			</tr>

			<tr style="display:block; width: 100%;text-align: center;">
				<td style=" display:block; width: 100%; text-align: center;">
					<a href="${data.appUrl}member/profile" style="background: #FF9933;display: inline-block; border:none; color: #fff;font-family: 'Montserrat',
						sans-serif;font-size: 18px;border-radius: 10px;text-decoration:none;padding: 15px 40px;">Go to my profile
					</a>
				</td>
			</tr>

			<tr style="height: 40px;">
				<td></td>
			</tr>

			<tr style="display:block; width: 100%;text-align: center;">
				<td style="display:block; width: 100%; text-align: center;">
					<p style="font-family: 'Montserrat', sans-serif;
					font-size: 16px;font-weight: 300;color:#626262;
					">
						Once the contract is approved, the player will be treated as a professional player on the YFTChain portal and his professional status will be associated with your ${category}.</p>
				</td>
			</tr>
			<tr style="height: 20px;">
				<td></td>
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