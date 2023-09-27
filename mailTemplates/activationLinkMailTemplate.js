module.exports = ({ email, activation_link, name }) => {
  return {
    to: email,
    subject: "Verify your email",
    // html: "",
    text: `Welcome to YFTChain.
'Please follow the below url for verifying your email: 
${activation_link}
'If you did not request this, please ignore this email.`,
    html(data) {
      return `

			<table
	width="100%"
	style="
   border-collapse: collapse;
   border-spacing: 0;
   padding: 0;
   vertical-align: top;
   "
></table>
	<table
		class="spacer"
		style="
   border-collapse: collapse;
   border-spacing: 0;
   padding: 0;
   vertical-align: top;
   width: 100%;
   "
	>
		<tbody>
			<tr style="padding: 0; vertical-align: top">
				<td
					height="20"
					style="
            -moz-hyphens: auto;
            -webkit-hyphens: auto;
            border-collapse: collapse !important;
            hyphens: auto;
            line-height: 20px;
            margin: 0;
            mso-line-height-rule: exactly;
            padding: 0;
            vertical-align: top;
            word-wrap: break-word;
            "
				></td>
			</tr>
		</tbody>
	</table>
	<table
		width="100%"
		style="
   border-collapse: collapse;
   border-spacing: 0;
   padding: 0;
   vertical-align: top;
   "
	>
		<tbody>
			<tr style="padding: 0; vertical-align: top">
				<th
					style="
            color: #626262;
            line-height: 1.3;
            margin: 0;
            padding: 0;
            "
				>
					<h2
						class="text-center"
						style="
               color: #626262;
               font-family: 'Paytone One',
               'Montserrat ', sans-serif;
               font-size: 30px;
               font-weight: 700;
               line-height: 1.3;
               margin: auto;
               padding: 0;
               text-align: center;
               width: 90%;
               word-wrap: normal;
               "
					>
						Thank you for Signing up!
            </h2>
					<h2
						class="text-center"
						style="
               color: #626262;
               font-family: 'Paytone One',
               'Montserrat ', sans-serif;
               font-size: 30px;
               font-weight: 700;
               line-height: 1.3;
               margin: auto;
               padding: 0;
               text-align: center;
               width: 90%;
               word-wrap: normal;
               "
					>
						${data.name.charAt(0).toUpperCase() + data.name.slice(1)}
					</h2>
				</th>
			</tr>
		</tbody>
	</table>
	<table
		class="spacer"
		style="
   border-collapse: collapse;
   border-spacing: 0;
   padding: 0;
   vertical-align: top;
   width: 100%;
   "
	>
		<tbody>
			<tr style="padding: 0; vertical-align: top">
				<td
					height="20"
					style="
            -moz-hyphens: auto;
            -webkit-hyphens: auto;
            border-collapse: collapse !important;
            color: #626262;
            hyphens: auto;
            margin: 0;
            mso-line-height-rule: exactly;
            padding: 0;
            vertical-align: top;
            word-wrap: break-word;
            "
				></td>
			</tr>
		</tbody>
	</table>
	<table
		width="100%"
		style="
   border-collapse: collapse;
   border-spacing: 0;
   padding: 0;
   vertical-align: top;
   "
	>
		<tbody>
			<tr style="padding: 0; vertical-align: top">
				<th style="margin: 0; padding: 0">
					<p
						class="text-center"
						style="
               color: #626262;
               font-family: Montserrat, sans-serif;
               font-size: 14px;
               font-weight: 300;
               line-height: 1.3;
               margin: auto;
               margin-bottom: 0px;
               padding: 0;
               text-align: center;
               width: 90%;
               "
					>
						We're very excited you're with us.
            </p>
				</th>
			</tr>
		</tbody>
	</table>
	<table
		class="spacer"
		style="
   border-collapse: collapse;
   border-spacing: 0;
   padding: 0;
   vertical-align: top;
   width: 100%;
   "
	>
		<tbody>
			<tr style="padding: 0; vertical-align: top">
				<td
					height="10"
					style="
            -moz-hyphens: auto;
            -webkit-hyphens: auto;
            border-collapse: collapse !important;
            hyphens: auto;
            margin: 0;
            mso-line-height-rule: exactly;
            padding: 0;
            vertical-align: top;
            word-wrap: break-word;
            "
				></td>
			</tr>
		</tbody>
	</table>
	<table
		width="100%"
		style="
   border-collapse: collapse;
   border-spacing: 0;
   padding: 0;
   vertical-align: top;
   "
	>
		<tbody>
			<tr style="padding: 0; vertical-align: top">
				<th style="margin: 0; padding: 0">
					<p
						class="text-center"
						style="
               color: #626262;
               font-family: Montserrat, sans-serif;
               font-size: 14px;
               font-weight: 300;
               line-height: 1.3;
               margin: auto;
               margin-bottom: 0px;
               padding: 0;
               text-align: center;
               width: 90%;
               "
					>
						To get started, please click below to
						confirm your email address. After that,
						you can verify your identity directly in
						the web version and get to the fun
						stuff!
            </p>
				</th>
			</tr>
		</tbody>
	</table>
	<table
		class="spacer"
		style="
   border-collapse: collapse;
   border-spacing: 0;
   padding: 0;
   vertical-align: top;
   width: 100%;
   "
	>
		<tbody>
			<tr style="padding: 0; vertical-align: top">
				<td
					height="20"
					style="
            -moz-hyphens: auto;
            -webkit-hyphens: auto;
            border-collapse: collapse !important;
            hyphens: auto;
            margin: 0;
            mso-line-height-rule: exactly;
            padding: 0;
            vertical-align: top;
            word-wrap: break-word;
            "
				></td>
			</tr>
		</tbody>
	</table>
	<table
		class="button large float-center radius"
		align="center"
		width="100%"
		style="
   border-collapse: collapse;
   border-spacing: 0;
   float: none;
   margin: 0;
   text-align: center;
   vertical-align: top;
   "
	>
		<tbody>
			<tr style="padding: 0; vertical-align: top">
				<td
					style="
            -moz-hyphens: auto;
            -webkit-hyphens: auto;
            border-collapse: collapse !important;
            hyphens: auto;
            margin: 0;
            padding: 0;
            vertical-align: top;
            word-wrap: break-word;
            "
				>
					<table
						align="center"
						style="
               border-collapse: collapse;
               border-spacing: 0;
               padding: 0;
               vertical-align: top;
               "
					>
						<tbody>
							<tr
								style="
                     padding: 0;
                     vertical-align: top;
                     "
							>
								<td
									style="
                        -moz-hyphens: auto;
                        -webkit-hyphens: auto;
                        border: none;
                        border-collapse: collapse !important;
                        margin: 0;
                        padding: 0;
                        vertical-align: top;
                        word-wrap: break-word;
                        "
								>
									<a
										href="${activation_link}"
										target="_blank"
										style="
                           color: #fff;
                           cursor: pointer;
                           display: inline-block;
                           font-family: Montserrat,
                           sans-serif;
                           font-size: 16px;
                           font-weight: 300;
                           line-height: 1.3;
                           margin: 0;
                           padding: 15px 35px 15px 35px;
                           text-decoration: none;
                           border: none;
                           background: #f93;
                           border-radius: 10px;
                           "
									>
										Verify your email
                        </a>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
	<table
		class="spacer"
		style="
   border-collapse: collapse;
   border-spacing: 0;
   padding: 0;
   vertical-align: top;
   width: 100%;
   "
	>
		<tbody>
			<tr style="padding: 0; vertical-align: top">
				<td
					height="20"
					style="
            -moz-hyphens: auto;
            -webkit-hyphens: auto;
            border-collapse: collapse !important;
            hyphens: auto;
            margin: 0;
            mso-line-height-rule: exactly;
            padding: 0;
            vertical-align: top;
            word-wrap: break-word;
            "
				>
					&nbsp;
         </td>
			</tr>
		</tbody>
	</table>
	<table
		width="100%"
		style="
   border-collapse: collapse;
   border-spacing: 0;
   padding: 0;
   vertical-align: top;
   "
	>
		<tbody>
			<tr style="padding: 0; vertical-align: top">
				<th style="margin: 0; padding: 0">
					<p
						class="text-center"
						style="
               color: #626262;
               font-family: Montserrat, sans-serif;
               font-size: 14px;
               font-weight: 300;
               line-height: 1.3;
               margin: auto;
               margin-bottom: 0px;
               padding: 0;
               text-align: center;
               width: 90%;
               "
					>
						Just so you know, we've attached some
						legal documents regarding your account.
						By clicking above you confirm the
						receipt of these documents.
            </p>
				</th>
			</tr>
		</tbody>
	</table>
	<table
		class="spacer"
		style="
   border-collapse: collapse;
   border-spacing: 0;
   padding: 0;
   vertical-align: top;
   width: 100%;
   "
	>
		<tbody>
			<tr style="padding: 0; vertical-align: top">
				<td
					height="20"
					style="
            -moz-hyphens: auto;
            -webkit-hyphens: auto;
            border-collapse: collapse !important;
            hyphens: auto;
            margin: 0;
            mso-line-height-rule: exactly;
            padding: 0;
            vertical-align: top;
            word-wrap: break-word;
            "
				>
					&nbsp;
         </td>
			</tr>
		</tbody>
	</table>
	<table
		width="100%"
		style="
   border-collapse: collapse;
   border-spacing: 0;
   padding: 0;
   vertical-align: top;
   "
	>
		<tbody>
			<tr style="padding: 0; vertical-align: top">
				<th style="margin: 0; padding: 0">
					<p
						class="text-center"
						style="
               color: #626262;
               font-family: Montserrat, sans-serif;
               font-size: 14px;
               font-weight: 300;
               line-height: 1.3;
               margin: auto;
               margin-bottom: 0px;
               padding: 0;
               text-align: center;
               width: 90%;
               "
					>
						If you have any issues with email
						verification, please contact us at:
               <a
							href="#dsf"
							style="
                  font-family: 'Montserrat',
                  sans-serif;
                  text-decoration: none;
                  font-weight: 400;
                  color: #ff9933;
                  "
						>${data.contactUsEmail}</a>
					</p>
				</th>
			</tr>
		</tbody>
	</table>
`;
    },
  };
};
