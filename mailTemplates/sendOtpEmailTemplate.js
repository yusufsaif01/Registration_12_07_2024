module.exports = ({ email, otp }) => {
  return {
    to: email,
    subject: "Website access request",
    html() {
      return `
            <tbody style="display: block; width: 80%; margin: auto;">
        <tr style="height: 20px;">
          <td></td>
        </tr>
        <!-- Heading of template -->
        <tr style="display: block; width: 100%; text-align: center;">
          <td style="display: block; width: 100%; text-align: center;">
            <h1 style="
                font-family: 'Paytone One', sans-serif;
                font-size: 48px;
                font-weight: 700;
                color: #626262;
              ">
              Hi there
            </h1>
          </td>
        </tr>
        <!--  -->

        <!-- paragraph -->
        <tr style="height: 20px;">
          <td></td>
        </tr>
        <tr style="display: block; width: 100%; text-align: center;">
          <td style="display: block; width: 100%; text-align: center;">
            <p style="
                font-family: 'Montserrat', sans-serif;
                font-size: 16px;
                font-weight: 300;
                color: #626262;
              ">
			Use the below OTP to access the website.
			</p>
            <p style="
                font-family: 'Montserrat', sans-serif;
                font-size: 20px;
                font-weight: 500;
                color: #626262;
				margin-top: 10px;
              ">
              ${otp}
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
        
        <!-- ends -->
        <!-- button bottom text -->
        <tr style="height: 20px;">
          <td></td>
        </tr>
        
        <!-- Handy points -->
        <tr style="height: 10px;">
          <td></td>
        </tr>

        <tr style="height: 20px;">
          <td></td>
        </tr>
        <!-- end  -->
      </tbody>
            `;
    },
    text: `Welcome to YFTChain.`,
  };
};
