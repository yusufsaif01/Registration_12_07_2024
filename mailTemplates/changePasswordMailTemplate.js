module.exports = ({ email }) => {
    return {
        to: email,
        subject: 'Password Changed',
        // html: "",
        text: `Your password has been changed.`,

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
						YFTChain account password change confirmation</h1>
				</td>
				<td style="display:block; width: 100%; text-align: center;">
					<h1 style="font-family: 'Paytone One', sans-serif;
					font-size: 48px;font-weight: 700;color:#626262">
						Hi ${data.name}</h1>
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
						As you requested, your password has been changed.</p>
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
						If you did not ask to change your password, then please ignore this email. If you wish to contact us, please email us at <span style="font-family: 'Montserrat', sans-serif;text-decoration:none;font-size: 16px;font-weight: 600;color:#FF9933">${data.contactUsEmail}</span></p>
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