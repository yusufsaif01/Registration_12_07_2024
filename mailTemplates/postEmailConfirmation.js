module.exports = ({ email, name }) => {
  return {
    to: email,
    subject: "We are making sure you're you",
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
						We’re just making sure you’re you</h1>
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
						Hey ${name}, welcome to YFTChain! We’re glad to have you onboard. All you have to do is
						verify your identity
						before you can start enjoying all showcasing features of YFTChain. Head to the YFTChain website
						now, and we’ll
						help you through everything</p>
				</td>
			</tr>
			<tr style="height: 10px;">
				<td></td>
			</tr>
			<tr style="display:block; width: 100%;text-align: center;">
				<td style=" display:block; width: 100%; text-align: center;">
					<p style="font-family: 'Montserrat', sans-serif;
					font-size: 16px;font-weight: 300;color:#626262;
					">
						It takes a couple of pictures of your Aadhaar Card or ID and yourself.</p>
				</td>
			</tr>
			<!-- button -->
			<tr style="height: 20px;">
				<td></td>
			</tr>
			<tr style="display:block; width: 100%;text-align: center;">
				<td style=" display:block; width: 100%; text-align: center;">
					<a href="${data.appUrl}member/profile" style="background: #FF9933;display: inline-block; border:none; color: #fff;font-family: 'Montserrat',
						sans-serif;font-size: 18px;border-radius: 10px;text-decoration:none;padding: 15px 40px;">Verify
						your identity
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
						Once you verify your identity, you will unlock a whole new world of features that will help you
						to showcase
						yourself to the professional football industry in India and start your journey to become a
						football legend! Upon
						verifying your identity, we will send an email to you notifying and educating you the list of
						unlocked features.
						Get started now!</p>
				</td>
			</tr>
			<!-- Handy points -->
			<tr style="height: 10px;">
				<td></td>
			</tr>
			<tr style="display:block; width: 100%;text-align: center;">
				<td style="display:block; width: 100%;text-align: center;">
					<h3 style="text-align: left;font-family: 'Montserrat', sans-serif;">
						Some Handy Pointers
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
					">1. Check your internet connection. ID verification works best on WiFi.</li>
						<li style="font-family: 'Montserrat', sans-serif;
					font-size: 16px;font-weight: 300;color:#626262;
					">2. Open your YFTChain profile and click on documents tab.</li>
						<li style="font-family: 'Montserrat', sans-serif;
					font-size: 16px;font-weight: 300;color:#626262;
					">3. Have your ID ready in formats including jpeg, png, pdf.</li>
						<li style="font-family: 'Montserrat', sans-serif;
					font-size: 16px;font-weight: 300;color:#626262;
					">4. Confirm your ID with us. You can complete your photo verification by uploading a passport
							size photo. </li>
					</ul>
				</td>
			</tr>
			<tr style="height: 10px;">
				<td></td>
			</tr>
			<!-- some handy pointer points end  -->

			<!-- After Notes -->
			<tr style="display:block; width: 100%;">
				<td style="display:block; width: 100%; text-align: left ;">
					<p style="font-family: 'Montserrat', sans-serif;
					font-size: 16px;font-weight: 300;color:#626262;
					">
						All it takes is picture of your ID and yourself. Simple!</p>
					<p style="font-family: 'Montserrat', sans-serif;
					font-size: 12px;font-weight: 500;color:#626262;
					">That’s it! We will confirm your identity in 48 hours and will confirm you by email and you can
						start enjoying
						our locked features.
					</p>
				</td>
			</tr>
			<!-- After Notes -->

			<!-- why have to verify -->
			<tr style="height: 20px;">
				<td></td>
			</tr>
			<tr style="display:block; width: 100%;text-align: center;">
				<td style="display:block; width: 100%;text-align: center;">
					<h3 style="text-align: center;font-family: 'Montserrat', sans-serif;">
						You might be wondering why we have to verify your identity…
					</h3>

				</td>
			</tr>
			<tr style="height: 10px;">
				<td></td>
			</tr>
			<tr style="display:block; width: 100%;text-align: center;">
				<td style="display:block; width: 100%;text-align: center;">
					<p style="font-family: 'Montserrat', sans-serif;
					font-size: 16px;font-weight: 300;color:#626262;
					">
						It’s a good question. We do this to make sure that person creating their account is really who
						they are. That
						keeps your identity safe from people who might want to use the account for misrepresentation.
					</p>
				</td>
			</tr>
			<tr style="height: 10px;">
				<td></td>
			</tr>
			<tr style="display:block; width: 100%;text-align: center;">
				<td style="display:block; width: 100%;text-align: center;">
					<p style="font-family: 'Montserrat', sans-serif;
					font-size: 16px;font-weight: 300;color:#626262;
					">
						Our mission is to help regulate and achieve more transparency in the football transfer market
						operating in India.
					</p>
				</td>
			</tr>
			<tr style="height: 20px;">
				<td></td>
			</tr>
			<!-- end -->
			<tr style=" height: 20px;">
				<td></td>
			</tr>
			<!-- end  -->
		</tbody>
            `;
    },
    text: `Welcome to YFTChain.`,
  };
};
