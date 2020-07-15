module.exports = ({ email, password_reset_link, name }) => {
    return {
        to: email,
        subject: 'Password Reset',
        // html: "",
        text: `You are receiving this because you have requested the reset of the password for your account.
          'Please follow the below url to complete the process: 
          ${password_reset_link}
          'If you did not request this, please ignore this email and your password will remain unchanged.`,

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
						YFTChain account password reset</h1>
				</td>
				<td style="display:block; width: 100%; text-align: center;">
					<h1 style="font-family: 'Paytone One', sans-serif;
					font-size: 48px;font-weight: 700;color:#626262">
						Hi ${name}</h1>
				</td>
			</tr>

			<!-- paragraph -->
			<tr style="height: 20px;">
				<td></td>
			</tr>
			<tr style="display:block; width: 100%;text-align: center;">
				<td style="display:block; width: 100%; text-align: center;">
					<p style="font-family: 'Montserrat', sans-serif;
					font-size: 16px;font-weight: 300;color:#626262;
					">
						We have received your request to reset your YFTChain password. To complete your request, please click on the link below</p>
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
					<a href="${password_reset_link}" style="background: #FF9933;display: inline-block; border:none; color: #fff;font-family: 'Montserrat',
						sans-serif;font-size: 18px;border-radius: 10px;text-decoration:none;padding: 15px 40px;">Reset your password
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
						Your username: <span style="font-family: 'Montserrat', sans-serif;text-decoration:none;font-size: 16px;font-weight: 600;color:#FF9933">${email}</span> (email of member)</p>
				</td>
			</tr>
			<!-- Handy points -->
			<tr style="height: 10px;">
				<td></td>
			</tr>
			<tr style="display:block; width: 100%;text-align: center;">
				<td style="display:block; width: 100%;text-align: center;">
					<h3 style="text-align: left;font-family: 'Montserrat', sans-serif;">
						A few tips to keep in mind while setting your password
					</h3>
				</td>
			</tr>
			<tr style="height: 10px;">
				<td></td>
			</tr>
			<!-- Handy point ends -->
			<!-- some handy pointer Points -->
			<tr style="display:block; width: 100%;text-align: center;">
				<td style="display:block; width: 100%; text-align: center;">
					<ul style="text-align: left;list-style: none;">
						<li style="font-family: 'Montserrat', sans-serif;
					font-size: 16px;font-weight: 300;color:#626262;
					">1. Password length would be between 8-20 characters.</li>
						<li style="font-family: 'Montserrat', sans-serif;
					font-size: 16px;font-weight: 300;color:#626262;
					">2. One special character i.e. !, @, #, $.</li>
						<li style="font-family: 'Montserrat', sans-serif;
					font-size: 16px;font-weight: 300;color:#626262;
					">3. One alphabet i.e. a, A, b, B, etc.</li>
						<li style="font-family: 'Montserrat', sans-serif;
					font-size: 16px;font-weight: 300;color:#626262;
					">4. One numeric character i.e. 1, 2, 3, 4, etc. </li>
					</ul>
				</td>
			</tr>
			<tr style="height: 10px;">
				<td></td>
			</tr>
			<!-- some handy pointer points end  -->
		
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