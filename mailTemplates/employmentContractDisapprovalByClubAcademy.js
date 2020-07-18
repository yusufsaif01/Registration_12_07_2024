module.exports = ({ email, name, reason, from, category }) => {
  return {
    to: email,
    subject: "Contract Disapproved",
    // html: "",
    text: `Employment Contract for ${name} has been disapproved due to ${reason} reason, Please update again.`,

    html (data) {
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
						Dear ${name},</h1>
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
						We apologise to inform you that ${from} has not approved your contract information due to ${reason}.</p>
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
						We request that you as a player verify that you are holding a valid contract by providing correct information.</p>
				</td>
			</tr>
			<tr style="display:block; width: 100%;text-align: center;">
				<td style="display:block; width: 100%; text-align: center;">
					<p style="font-family: 'Montserrat', sans-serif;
					font-size: 16px;font-weight: 300;color:#626262;
					">
						Please click below to go to the YFTChain's portal and add/update your contract information.</p>
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
						Once your contract has been approved, you will be treated as a professional player on the YFTChain portal and your professional status will be associated with ${from}.</p>
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
    }
  };
};