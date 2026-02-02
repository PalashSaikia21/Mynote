export const Verification_Email_Template = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
          body {
              font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #121212; /* Deep dark background */
              color: #eeeeee;            /* Off-white text for readability */
          }
          .container {
              max-width: 600px;
              margin: 40px auto;
              background: #1e1e1e;       /* Slightly lighter charcoal */
              border-radius: 4px;
              overflow: hidden;
              border: 1px solid #ffbf00; /* Amber border */
              box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          }
          .header {
              background-color: #ffbf00; /* Primary Amber */
              color: #000000;            /* Black text ONLY on Amber background */
              padding: 25px;
              text-align: center;
              font-size: 22px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 2px;
          }
          .content {
              padding: 40px 30px;
              text-align: center;
              line-height: 1.6;
          }
          .instruction {
              font-size: 16px;
              color: #cccccc;
              margin-bottom: 25px;
          }
          .verification-code {
              display: inline-block;
              margin: 20px 0;
              font-size: 36px;
              color: #ffbf00;            /* Amber Code */
              background: #2a2a2a;       /* Darker box for the code */
              -webkit-user-select: all;
              user-select: all;
              border: 2px solid #ffbf00;
              padding: 15px 40px;
              letter-spacing: 8px;
              font-weight: 900;
              font-family: monospace;
              border-radius: 4px;
          }
          .footer {
              background-color: #121212;
              padding: 20px;
              text-align: center;
              color: #666666;
              font-size: 12px;
              border-top: 1px solid #333;
          }
          p { margin: 0 0 15px; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Identity Verification</div>
          <div class="content">
              <p class="instruction">To complete your registration and secure your account, use the following one-time password (OTP):</p>
              <div class="verification-code">{verificationCode}</div>
              <p style="margin-top: 25px; font-size: 14px; color: #888;">
                  This code will expire shortly. If you did not request this, you can safely ignore this email.
              </p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} My Note Security by design.</p>
          </div>
      </div>
  </body>
  </html>
`;

export const Welcome_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome</title>
      <style>
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #1a1a1a; /* Dark background to match amber theme */
              color: #e0e0e0;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #242424;
              border-radius: 4px;
              overflow: hidden;
              border: 1px solid #ffbf00; /* Amber Border */
          }
          .header {
              background-color: #ffbf00; /* Cognitive Amber Primary */
              color: #1a1a1a;
              padding: 30px;
              text-align: center;
              font-size: 24px;
              font-weight: 800;
              letter-spacing: 1px;
              text-transform: uppercase;
          }
          .content {
          background-color: #1a1a1a; /* Dark background */
    color: #e0e0e0;            /* Light gray text for readability */
              padding: 30px;
              line-height: 1.6;
          }
          .welcome-message {
              font-size: 20px;
              color: #ffbf00;
              margin-bottom: 20px;
          }
          .button {
              display: inline-block;
              padding: 14px 30px;
              margin: 25px 0;
              background-color: #ffbf00;
              color: #1a1a1a !important;
              text-decoration: none;
              border-radius: 2px;
              font-size: 16px;
              font-weight: bold;
          }
          .footer {
              padding: 20px;
              text-align: center;
              color: #777;
              font-size: 11px;
              background-color: #1a1a1a;
          }
          ul {
              padding-left: 20px;
              color: #ccc;
          }
          li {
              margin-bottom: 10px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">My Note</div>
          <div class="content">
              <p class="welcome-message">Hello {name},</p>
              <p>You’re in. We kept it simple: Write notes, find people, and stay organized. No bloat, no nonsense.</p>
              <p><strong>Immediate next steps:</strong></p>
              <ul>
                  <li><strong>Write:</strong> Your first note is waiting.</li>
                  <li><strong>Secure:</strong> Update your profile and set your security questions.</li>
                  <li><strong>Explore:</strong> Find how your notes connect with others.</li>
              </ul>
              <a href="YOUR_LOGIN_URL_HERE" class="button">START NOTING</a>
              <p style="font-size: 14px; margin-top: 20px;">Need help? Reply to this email. We're here.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Cognitive Amber. Built for focus.</p>
          </div>
      </div>
  </body>
  </html>
`;
