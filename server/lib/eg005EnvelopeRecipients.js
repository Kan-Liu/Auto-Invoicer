/**
 * @file
 * Example 005: envelope list recipients
 * @author DocuSign
 */
const axios = require("axios"),
  dsConfig = require("../../src/ds_configuration").config;

const eg005EnvelopeRecipients = exports;
/**
 * List the envelope recipients
 * @param {object} req Request obj
 * @param {object} res Response obj
 */
eg005EnvelopeRecipients.createController = async (req, res) => {
  // Step 1. Check the token
  // At this point we should have a good token. But we
  // double-check here to enable a better UX to the user.
  let body = req.body;
  // Step 2. Call the worker method
  let args = {
      accessToken: body.accessToken,
      basePath: "https://demo.docusign.net/restapi",
      accountId: "6ac59805-cccb-45bd-af23-7056f2bc1353",
      envelopeId: body.envelopeId
    },
    results = null;

  try {
    results = await eg005EnvelopeRecipients.worker(args);
  } catch (error) {
    let errorBody = error && error.response && error.response.body,
      // we can pull the DocuSign error code and message from the response body

      errorMessage = errorBody && errorBody.message;

    console.log(errorMessage);
  }
  if (results) {
    res.send({
      status: results.data.signers[0].tabs.formulaTabs[0].paymentDetails.status
    });
  }
};

/**
 * This function does the work of listing the envelope's recipients
 * @param {object} args object
 */
// ***DS.snippet.0.start
eg005EnvelopeRecipients.worker = async args => {
  // Data for this method
  // args.basePath
  // args.accessToken
  // args.accountId
  // args.envelopeId

  let results = null;
  let axiosInstance = axios.create({
    baseURL: args.basePath,
    headers: { Authorization: "Bearer " + args.accessToken }
  });

  results = await axiosInstance.get(
    `/v2.1/accounts/${args.accountId}/envelopes/${
      args.envelopeId
    }/recipients?include_tabs=true`
  );
  return results;
};
// ***DS.snippet.0.end
