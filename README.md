# Auto-Invoicer

A web app hosted on a self-built node server that auto-generates a payment invoice that can be sent to designated recipient via email, requiring signature via DocuSign and payment via Stripe gateway.

## App Installation and Configuration

(Information in this section is partially from [DocuSign developer code example](https://github.com/docusign/eg-03-node-auth-code-grant). )

### Prerequisites

1. A DocuSign Developer Sandbox account (email and password) on [demo.docusign.net](https://demo.docusign.net).
   Create a [free account](https://go.docusign.com/sandbox/productshot/?elqCampaignId=16534).
1. A DocuSign Integration Key (a client ID) that is configured to use the
   OAuth Authorization Code flow.
   You will need the **Integration Key** itself, and its **secret**.

   If you use this example on your own workstation,
   the Integration key must include a **Redirect URI** of `http://localhost:5000/ds/callback`

   If you will not be running the example on your own workstation,
   use the appropriate DNS name and port instead of `localhost`

1. Node.JS v8.10 or later and NPM v5 or later.
1. A name and email for a signer, and a name and email for a cc recipient.
   The signer and the cc email cannot be the same.

### Installation steps

1. Download or clone this repository to your workstation to directory **Auto-Invoicer**
1. **cd Auto-Invoicer**
1. **npm install** to install all the dependecies
1. _Either:_

   - Update the file **ds_configuration.js** in the project's root directory
     with the Integration Key
     and other settings, _or_
   - Create and export environment variables for the settings.
     See the **ds_configuration.js** file
     for the names of the environment variables.

   **Note:** Protect your Integration Key and secret--If you update
   the ds_configuration.js file, then you
   should ensure that it will not be stored in your source code
   repository.

1. **npm start** to initiate the React local server
1. **node server/server.js** to initiate the node server
1. Open a browser to **http://localhost:5000**

## App Workflow Demo

1. Use the login button on this welcome page to log into your configured DocuSign account
   ![Alt text](https://github.docusignhq.com/Integrations/Auto-Invoicer/blob/master/public/welcome.png)
1. It will lead to the OAuth2 login page for DocuSign to authenticate
   ![Alt text](https://github.docusignhq.com/Integrations/Auto-Invoicer/blob/master/public/auth.png)
1. Successful authentication will lead back to the main app page of Auto-Invoicer. The access token from OAuth2 protocol is encrypted on the node server once received for enhanced secuity
   ![Alt text](https://github.docusignhq.com/Integrations/Auto-Invoicer/blob/master/public/main.png)
1. Enter Recipient Name, Email address, and Amount to generate and send the Invoice via DocuSign. Record the Envelope ID for future reference
   ![Alt text](https://github.docusignhq.com/Integrations/Auto-Invoicer/blob/master/public/sent.png)
1. An unsigned invoice proof is also downloaded for reference. The proof also includeds a spelt-out charged amount and an unsigned signature placeholder
   ![Alt text](https://github.docusignhq.com/Integrations/Auto-Invoicer/blob/master/public/proof.png)
1. The recipient will receive an email notice from DocuSign to review and pay the invoice
   ![Alt text](https://github.docusignhq.com/Integrations/Auto-Invoicer/blob/master/public/email.png)
1. The link in the email will lead to the DocuSign interface for Signature and Payment
   ![Alt text](https://github.docusignhq.com/Integrations/Auto-Invoicer/blob/master/public/dspage.png)
1. After signing and reviewing the invoice, the recipient can pay electronically via the Stripe Gateway
   ![Alt text](https://github.docusignhq.com/Integrations/Auto-Invoicer/blob/master/public/payment.png)
1. The invoice sender can also track the payment status most recent invoice sent or track invoice by its Envelope ID
   ![Alt text](https://github.docusignhq.com/Integrations/Auto-Invoicer/blob/master/public/checkLast.png)
   ![Alt text](https://github.docusignhq.com/Integrations/Auto-Invoicer/blob/master/public/checkId.png)
1. The user can log out from Auto-Invoicer any time using the Log Out button at the bottom of the page anytime, navigating back to the welcome page
   ![Alt text](https://github.docusignhq.com/Integrations/Auto-Invoicer/blob/master/public/main.png)

## Tech Stacks Involved

- Powered by [DocuSign signature and payment APIs](https://developers.docusign.com/overview)
- Payment provided by [Stripe Gateway](https://support.stripe.com/questions/merchant-accounts-gateways-and-stripe)
- Authenticated by [OAuth2 protocol](https://oauth.net/2/), [Passport.js](http://www.passportjs.org/) and [Passport-DocuSign](https://www.npmjs.com/package/passport-docusign)
- Server supported by [Express](https://expressjs.com/) and [Axios](https://www.axios.com/)
- Client side bootstrapped with [Create React App](https://github.com/facebook/create-react-app)
- Developed with [Node.js](https://nodejs.org/en/) and [TypeScript](https://www.typescriptlang.org/)
