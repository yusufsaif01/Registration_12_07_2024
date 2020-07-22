module.exports = ({ email }) => {
    return {
      to: email,
      subject: "Welcome to YFTChain",
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
              Hi there, new friend!
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
			We thank you for joining the YFTChain community and now we're excited to show you what's next. As a subscriber, you'll be among the first to know when we launch our private beta. In the meantime, hold tight and we'll be in contact from time-to-time with updates.
			</p>
            <p style="
                font-family: 'Montserrat', sans-serif;
                font-size: 16px;
                font-weight: 300;
                color: #626262;
				margin-top: 10px;
              ">
              A big thank you, from all of us at the YFTChain's team in India and Ireland!
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