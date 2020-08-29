module.exports = ({ email, approved, approver, reason }) => {
	approved.name = approved.name.charAt(0).toUpperCase() + approved.name.slice(1)
  return {
    to: email,
    subject: `${approved.name} employment contract details not approved`,
    // html: "",
    text: `Employment Contract for ${approved.name} has been disapproved due to ${reason} reason, Please update again.`,

    html() {
      return `
        <tbody style="display: block;width: 80%; margin:auto;">
			<tr style="height: 20px;">
				<td></td>
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
						Hello Admin
					</p>
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
						A contract submitted by following ${approved.type} has been disapproved by ${approver.type}.
					</p>
				</td>
			</tr>

			<tr style="height: 10px;">
				<td></td>
			</tr>

			<tr style="display:block; width: 100%;text-align: center;">
				<td style="display:block; width: 100%; text-align: center;">
					<p style="font-family: 'Montserrat', sans-serif;
					font-size: 20px; font-weight: 700;display:block;color:#626262;">
						Disapproval member name: ${approver.name.charAt(0).toUpperCase() + approver.name.slice(1)}
					</p>
					<p style="font-family: 'Montserrat', sans-serif;
					font-size: 20px; font-weight: 700;display:block;color:#626262;">
						Disapproval member email: ${approver.email}
					</p>
				</td>
			</tr>

			<tr style="height: 10px;">
				<td></td>
			</tr>

			<tr style="display:block; width: 100%;text-align: center;">
				<td style="display:block; width: 100%; text-align: center;">
					<p style="font-family: 'Montserrat', sans-serif;
					font-size: 20px; font-weight: 700;display:block;color:#626262;">
						Disapproved member name: ${approved.name}
					</p>
					<p style="font-family: 'Montserrat', sans-serif;
					font-size: 20px; font-weight: 700;display:block;color:#626262;">
						Disapproved member email: ${approved.email}
					</p>
				</td>
			</tr>
			<tr style="display:block; width: 100%;text-align: center;">
				<td style="display:block; width: 100%; text-align: center;">
					<p style="font-family: 'Montserrat', sans-serif;
					font-size: 20px; font-weight: 700;display:block;color:#626262;">
						Reason: ${reason}
					</p>
				</td>
			</tr>


			<tr style="height: 40px;">
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
