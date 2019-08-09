// ds_configuration.js -- configuration information
// Either fill in the data below or set the environment variables
//
exports.config = {
  dsClientId: process.env.DS_CLIENT_ID || "{DocuSign Integration Key}", // The app's DocuSign integration key
  dsClientSecret:
    process.env.DS_CLIENT_SECRET || "{DocuSign Integration Key's Secret}", // The app's DocuSign integration key's secret
  signerEmail: process.env.DS_SIGNER_EMAIL || "{Signer's email}",
  signerName: process.env.DS_SIGNER_NAME || "{Signer's name}",
  appUrl: process.env.DS_APP_URL || "http://localhost:5000", // The url of the application. Eg http://localhost:5000
  // NOTE: You must add a Redirect URI of appUrl/ds/callback to your Integration Key.
  // Example: http://localhost:5000/ds/callback
  production: false,
  debug: true, // Send debugging statements to console
  sessionSecret: "12345", // Secret for encrypting session cookie content
  allowSilentAuthentication: true, // a user can be silently authenticated if they have an
  // active login session on another tab of the same browser
  targetAccountId: null, // Set if you want a specific DocuSign AccountId, If null, the user's default account will be used.

  gatewayAccountId:
    process.env.DS_PAYMENT_GATEWAY_ID || "{DocuSign Payment Gateway ID}",
  gatewayName: "stripe",
  gatewayDisplayName: "Stripe",

  documentation: null,
  // Should source files for different software languages be shown?
  multiSourceChooser: false
};
exports.config.dsOauthServer = exports.config.production
  ? "https://account.docusign.com"
  : "https://account-d.docusign.com";
