/**
 * @file
 * Example 014: Remote signer, cc, envelope has an order form
 * @author DocuSign
 */

const docusign = require("docusign-esign"),
  dsConfig = require("../../src/ds_configuration").config;

const eg014CollectPayment = exports;
/**
 * Create the envelope
 * @param {object} req Request obj
 * @param {object} res Response obj
 */
eg014CollectPayment.createController = async (req, res) => {
  // Step 2. Call the worker method
  let body = req.body;
  // Additional data validation might also be appropriate

  let envelopeArgs = {
      signerEmail: body.Email,
      signerName: body.Recipient,
      chargedAmount: body.Amount,
      pdf64: body.pdf64,
      status: "sent",
      gatewayAccountId: dsConfig.gatewayAccountId,
      gatewayName: dsConfig.gatewayName,
      gatewayDisplayName: dsConfig.gatewayDisplayName
    },
    args = {
      accessToken: body.accessToken,
      // basePath: req.session.basePath,
      basePath: "https://demo.docusign.net/restapi",
      accountId: "6ac59805-cccb-45bd-af23-7056f2bc1353",
      envelopeArgs: envelopeArgs
    },
    results = null;
  console.log(args);
  try {
    results = await eg014CollectPayment.worker(args);
  } catch (error) {
    let errorBody = error && error.response && error.response.body,
      // we can pull the DocuSign error code and message from the response body

      errorMessage = errorBody && errorBody.message;

    console.log(errorMessage);
  }
  if (results) {
    req.session.envelopeId = results.envelopeId; // Save for use by other examples
    console.log("Envelope Id: " + results.envelopeId);
    // which need an envelopeId
    res.send({ envelopeId: results.envelopeId });
  }
};

/**
 * This function does the work of creating the envelope
 * @param {object} args object
 */
// ***DS.snippet.0.start
eg014CollectPayment.worker = async args => {
  // Data for this method
  // args.basePath
  // args.accessToken
  // args.accountId

  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(args.basePath);
  dsApiClient.addDefaultHeader("Authorization", "Bearer " + args.accessToken);
  let envelopesApi = new docusign.EnvelopesApi(dsApiClient);

  // Step 1. Make the envelope request body
  let envelope = makeEnvelope(args.envelopeArgs);

  // Step 2. call Envelopes::create API method
  // Exceptions will be caught by the calling function
  let results = await envelopesApi.createEnvelope(args.accountId, {
    envelopeDefinition: envelope
  });
  let envelopeId = results.envelopeId;
  return { envelopeId: envelopeId };
};

/**
 * Creates envelope
 * <br>Document 1: An HTML document.
 * <br>DocuSign will convert all of the documents to the PDF format.
 * <br>The recipients' field tags are placed using <b>anchor</b> strings.
 * @function
 * @param {Object} args object
 * @returns {Envelope} An envelope definition
 * @private
 */
function makeEnvelope(args) {
  // Data for this method
  // args.signerEmail
  // args.signerName
  // args.ccEmail
  // args.ccName
  // args.status
  // args.gatewayAccountId
  // args.gatewayName
  // args.gatewayDisplayName
  // demoDocsPath  -- module global
  // doc1File  -- module global

  // Substitute values into the HTML
  // Substitute for: {signerName}, {signerEmail}, {ccName}, {ccEmail}

  // create the envelope definition
  let env = new docusign.EnvelopeDefinition();
  env.emailSubject = "Please review your invoice";

  // add the documents
  let doc1 = new docusign.Document(),
    doc1b64 = args.pdf64.split(",")[1];
  doc1.documentBase64 = doc1b64;
  doc1.name = "Invoice form"; // can be different from actual file name
  doc1.fileExtension = "html"; // Source data format. Signed docs are always pdf.
  doc1.documentId = "1"; // a label used to reference the doc
  env.documents = [doc1];

  // create a signer recipient to sign the document, identified by name and email
  // We're setting the parameters via the object creation
  let signer1 = docusign.Signer.constructFromObject({
    email: args.signerEmail,
    name: args.signerName,
    recipientId: "1",
    routingOrder: "1"
  });
  // routingOrder (lower means earlier) determines the order of deliveries
  // to the recipients. Parallel routing order is supported by using the
  // same integer as the order for two or more recipients.

  // create a cc recipient to receive a copy of the documents, identified by name and email
  // We're setting the parameters via setters

  // Tabs are set per recipient / signer
  let signer1Tabs = {
    signHereTabs: [
      {
        tabLabel: "Signature 5d0443c5-8b52-42e4-ace9-d37597fc64d1",
        conditionalParentLabel: null,
        conditionalParentValue: null,
        recipientId: "1",
        pageNumber: 1,
        documentId: "1",
        xPosition: 132,
        yPosition: 734,
        scaleValue: 1,
        optional: false,
        trackingId: "c275",
        trackingid: "c275"
      }
    ],
    numberTabs: [
      {
        tabLabel: "RequestedPayment f839cbf7-d3cf-403b-a558-6cfb48dd1f42",
        conditionalParentLabel: null,
        conditionalParentValue: null,
        fontSize: "size16",
        underline: false,
        italic: false,
        fontColor: "black",
        bold: true,
        font: "timesnewroman",
        required: true,
        locked: true,
        concealValueOnDocument: false,
        name: "",
        shared: false,
        requireAll: false,
        requireInitialOnSharedChange: false,
        value: args.chargedAmount,
        validationPattern: "",
        validationMessage: "",
        disableAutoSize: false,
        maxLength: 4000,
        width: 84,
        height: 22,
        mergeFieldXml: "",
        pageNumber: 1,
        documentId: "1",
        recipientId: "1",
        xPosition: 124,
        yPosition: 95,
        trackingId: "c406",
        trackingid: "c406"
      }
    ],
    formulaTabs: [
      {
        tabLabel: "PaymentReceipt 2f07e6dc-a750-4da9-9b58-26ba1942b471",
        conditionalParentLabel: null,
        conditionalParentValue: null,
        fontSize: "size9",
        underline: false,
        italic: false,
        fontColor: "black",
        bold: false,
        font: "lucidaconsole",
        concealValueOnDocument: false,
        name: "",
        roundDecimalPlaces: 0,
        formula:
          "([RequestedPayment f839cbf7-d3cf-403b-a558-6cfb48dd1f42]) * 100",
        width: 42,
        required: true,
        locked: true,
        hidden: true,
        pageNumber: 1,
        paymentDetails: {
          currencyCode: "USD",
          gatewayAccountId: args.gatewayAccountId,
          gatewayName: args.gatewayName,
          paymentOption: "authorize",
          lineItems: [
            {
              amountReference:
                "RequestedPayment f839cbf7-d3cf-403b-a558-6cfb48dd1f42"
            }
          ],
          customMetadataRequired: false,
          customMetadata: ""
        },
        recipientId: "1",
        documentId: "1",
        xPosition: 0,
        yPosition: 0,
        height: 0,
        trackingId: "c415",
        trackingid: "c415"
      }
    ]
  };
  signer1.tabs = signer1Tabs;

  // Add the recipients to the envelope object
  let recipients = {
    signers: [signer1]
  };
  env.recipients = recipients;

  // Request that the envelope be sent by setting |status| to "sent".
  // To request that the envelope be created as a draft, set to "created"
  env.status = args.status;

  return env;
}
// ***DS.snippet.0.end
