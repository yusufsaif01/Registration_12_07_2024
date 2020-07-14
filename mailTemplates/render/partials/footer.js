module.exports = (footer) => {
  return `
      <tfoot
        style="
          display: block;
          width: 100%;
          background: #fbf9f9;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
        "
      >
        <tr style="height: 20px;">
          <td></td>
        </tr>
        <!-- social media -->
        <tr style="display: block; width: 100%;">
          <td style="display: block; width: 100%; text-align: center;">
            <!-- social -->
            <div style="display: block; width: 100%; text-align: center;">
              <ul style="list-style: none; padding: 0px;">
                <li style="display: inline-block; width: 50px;">
                  <a
                    href="${footer.socialLinks.instagram}"
                    style="display: inline-block; text-decoration: none;"
                  >
                    <img src="${footer.appUrl}assets/images/website/social/instagram.svg" alt="instagram" />
                  </a>
                </li>
                <li style="display: inline-block; width: 50px;">
                  <a
                    href="${footer.socialLinks.facebook}"
                    style="display: inline-block; text-decoration: none;"
                  >
                    <img src="${footer.appUrl}assets/images/website/social/facebook.svg" alt="facebook" />
                  </a>
                </li>
                <li style="display: inline-block; width: 50px;">
                  <a
                    href="${footer.socialLinks.linkedin}"
                    style="display: inline-block; text-decoration: none;"
                  >
                    <img src="${footer.appUrl}assets/images/website/social/linkedin.svg" alt="Linkedin" />
                  </a>
                </li>
                <li style="display: inline-block; width: 50px;">
                  <a
                    href="${footer.socialLinks.twitter}"
                    style="display: inline-block; text-decoration: none;"
                  >
                    <img src="${footer.appUrl}assets/images/website/social/twitter.svg" alt="twitter" />
                  </a>
                </li>
              </ul>
            </div>
          </td>
        </tr>
        <tr style="height: 10px;">
          <td></td>
        </tr>
        <!-- copyright text -->
        <tr style="display: block; width: 100%; height: 30px;">
          <td style="display: block; width: 100%; text-align: center;">
            <p
              style="
                font-family: 'Montserrat', sans-serif;
                font-size: 16px;
                font-weight: 600;
                color: #626262;
              "
            >
              Copyright @ 2020, ${footer.appName}, All rights are reserved.
            </p>
          </td>
        </tr>
        <!-- footerlinks -->
        <tr style="display: block; width: 100%; height: 30px;">
          <td style="display: block; width: 100%; text-align: center;">
            <ul>
              <li style="display: inline-block; width: 120px;">
                <a
                  style="
                    font-family: 'Montserrat', sans-serif;
                    text-decoration: none;
                    font-size: 16px;
                    font-weight: 600;
                    color: #ff9933;
                  "
                  href="${footer.footerLinks.privacyPolicy}"
                  >Privacy policy</a
                >
              </li>
              <li style="display: inline-block; width: 10px; font-weight: 700;">
                |
              </li>
              <li style="display: inline-block; width: 180px;">
                <a
                  style="
                    font-family: 'Montserrat', sans-serif;
                    text-decoration: none;
                    font-size: 16px;
                    font-weight: 600;
                    color: #ff9933;
                  "
                  href="${footer.footerLinks.termsConditions}"
                  >Terms & Conditions</a
                >
              </li>
              <li style="display: inline-block; width: 10px; font-weight: 700;">
                |
              </li>
              <li style="display: inline-block; width: 120px;">
                <a
                  style="
                    font-family: 'Montserrat', sans-serif;
                    text-decoration: none;
                    font-size: 16px;
                    font-weight: 600;
                    color: #ff9933;
                  "
                  href="${footer.footerLinks.contactUs}"
                  >Contact us</a
                >
              </li>
            </ul>
          </td>
        </tr>
        <tr style="height: 20px;">
          <td></td>
        </tr>
      </tfoot>
    </table>
  </body>
</html>

    `;
};
