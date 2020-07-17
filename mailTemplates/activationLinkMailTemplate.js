module.exports = ({ email, activation_link, name }) => {
    return {
        to: email,
        subject: 'Email Verification',
        // html: "",
        text: `Welcome to YFTChain.
          'Please follow the below url for verifying your email: 
          ${activation_link}
          'If you did not request this, please ignore this email.`,
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
						Thank you for Signing up!</h1>
				</td>
				<td style="display:block; width: 100%; text-align: center;">
					<h1 style="font-family: 'Paytone One', sans-serif;
					font-size: 48px;font-weight: 700;color:#626262">
						${data.name}</h1>
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
						We're very excited you're with us.
						</p>
				</td>
			</tr>
			<tr style="height: 10px;">
				<td></td>
			</tr>
			<tr>
				<td style="display:block; width: 100%; text-align: center;">
					<p style="font-family: 'Montserrat', sans-serif;
					font-size: 16px;font-weight: 300;color:#626262;
					">
						To get started, please click below to confirm your email address. After that, you can verify your identity directly in the web version and get to the fun stuff!
						</p>
				</td>
			</tr>
			<tr style="height: 10px;">
				<td></td>
			</tr>
			<!-- button -->
			<tr style="height: 20px;">
				<td></td>
			</tr>
			<tr style="display:block; width: 100%;text-align: center;">
				<td style=" display:block; width: 100%; text-align: center;">
					<a href="${activation_link}" style="background: #FF9933;display: inline-block; border:none; color: #fff;font-family: 'Montserrat',
						sans-serif;font-size: 18px;border-radius: 10px;text-decoration:none;padding: 15px 40px;">Verify your email
					</a>
				</td>
			</tr>
			<!-- ends -->
			<!-- button bottom text -->
			<tr style="height:20px;">
				<td></td>
			</tr>
			<tr style="display:block; width: 100%;text-align: center;">
				<td style="display:block; width: 100%; text-align: center;">
					<p style="font-family: 'Montserrat', sans-serif;
					font-size: 16px;font-weight: 300;color:#626262;
					">
					Just so you know, we've attached some legal documents regarding your account. By clicking above you confirm the receipt of these documents.
					</p>
				</td>
			<tr>
			<tr style="height: 10px;">
				<td></td>
			</tr>
			<tr>
				<td>
					<p style="font-family: 'Montserrat', sans-serif;
					font-size: 16px;font-weight: 300;color:#626262;
					">
					If you have any issues with email verification, please contact us at: <span style="font-family: 'Montserrat', sans-serif;text-decoration:none;font-size: 16px;font-weight: 600;color:#FF9933">${data.contactUsEmail}</span>
					</p>
				</td>
			</tr>
			<!-- Handy points -->
			<tr style="height: 10px;">
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
        }
    };
};