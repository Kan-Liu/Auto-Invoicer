import React, { Component } from "react";
import * as Converter from "./Converter";
import jsPDF from "jspdf";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import * as symCrypt from "./symCrypt";
import { config } from "./ds_configuration";
import "./App.css";

const PORT = 5000;
const lineLimit = 62;
const baseURL = "http://localhost:";

interface State {
  Recipient: string;
  Email: string;
  Amount: number;
  accessToken: string;
  lastenvelopeId: string;
  givenenvelopeId: string;
  showAlert: boolean;
  strToShow: string;
  strHeading: string;
  alertType: "success" | "danger" | "info" | "warning";
  showAlert2: boolean;
  strToShow2: string;
  strHeading2: string;
  alertType2: "success" | "danger" | "info" | "warning";
}

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2
});

class App extends Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.handleChangeAmount = this.handleChangeAmount.bind(this);
    this.handleChangeRecipient = this.handleChangeRecipient.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClickSubmit = this.handleClickSubmit.bind(this);
    this.handleClickLogIn = this.handleClickLogIn.bind(this);
    this.handleClickLogout = this.handleClickLogout.bind(this);
    this.handleCheckLastEnvelope = this.handleCheckLastEnvelope.bind(this);
    this.handleCheckStatus = this.handleCheckStatus.bind(this);
    this.handleRecordStatus = this.handleRecordStatus.bind(this);
    this.handleCloseAlert = this.handleCloseAlert.bind(this);
    this.handleCloseAlert2 = this.handleCloseAlert2.bind(this);
  }
  state: State = {
    Recipient: "",
    Email: "",
    Amount: 0,
    accessToken: "",
    lastenvelopeId: "",
    givenenvelopeId: "",
    showAlert: false,
    strToShow: "",
    strHeading: "",
    alertType: "success",
    showAlert2: false,
    strToShow2: "",
    strHeading2: "",
    alertType2: "success"
  };

  handleClickLogIn(event: any) {
    window.location.href = baseURL + PORT + "/ds/login";
  }

  handleClickLogout(event: any) {
    this.setState({
      accessToken: ""
    });
    window.location.href = baseURL + PORT + "/ds/logout";
  }

  handleChangeRecipient(event: any) {
    this.setState({
      Recipient: event.target.value
    });
  }

  handleChangeEmail(event: any) {
    this.setState({
      Email: event.target.value
    });
  }

  handleChangeAmount(event: any) {
    this.setState({
      Amount: event.target.value
    });
  }

  handleCloseAlert() {
    this.setState({
      showAlert: false
    });
  }
  handleCloseAlert2() {
    this.setState({
      showAlert2: false
    });
  }

  handleCheckLastEnvelope(event: any) {
    console.log("Check envelope token: " + this.state.accessToken);

    if (!this.state.lastenvelopeId) {
      // alert("No envelope has been sent yet!");
      this.setState({
        showAlert2: true,
        strHeading2: "Empty Input",
        strToShow2: "No envelope has been sent yet!",
        alertType2: "warning"
      });
    } else {
      axios
        .post("/checkenvelope", {
          envelopeId: this.state.lastenvelopeId,
          accessToken: this.state.accessToken
        })
        .then(response => {
          var status = "";

          switch (response.data.status) {
            case "new": {
              status = "Unpaid";
              this.setState({ alertType2: "warning" });
              break;
            }
            case "auth_complete": {
              status =
                "Payment info has been entered but payment is not complete";
              this.setState({ alertType2: "info" });
              break;
            }
            case "payment_complete": {
              status = "Payment is complete";
              this.setState({ alertType2: "success" });
              break;
            }
            case "payment_capture_failed": {
              status = "Payment failed";
              this.setState({ alertType2: "danger" });
              break;
            }
            default: {
              break;
            }
          }
          // alert(`Payment Status: ${status}.`);
          this.setState({
            showAlert2: true,
            strHeading2: "Payment Status",
            strToShow2: status
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }

  alertInAxios(Heading: string, content: string, type: string) {}

  handleRecordStatus(event: any) {
    this.setState({
      givenenvelopeId: event.target.value
    });
  }

  handleCheckStatus(event: any) {
    if (!this.state.givenenvelopeId) {
      // alert("Please enter a valid Envelope ID!");
      this.setState({
        showAlert2: true,
        strHeading2: "Empty Input",
        strToShow2: "Please enter a valid Envelope ID!",
        alertType2: "warning"
      });
    } else {
      axios
        .post("/checkenvelope", {
          envelopeId: this.state.givenenvelopeId,
          accessToken: this.state.accessToken
        })
        .then(response => {
          var status = "";

          switch (response.data.status) {
            case "new": {
              status = "Unpaid";
              this.setState({ alertType2: "warning" });
              break;
            }
            case "auth_complete": {
              status =
                "Payment info has been entered but payment is not complete";
              this.setState({ alertType2: "info" });
              break;
            }
            case "payment_complete": {
              status = "Payment is complete";
              this.setState({ alertType2: "success" });
              break;
            }
            case "payment_capture_failed": {
              status = "Payment failed";
              this.setState({ alertType2: "danger" });
              break;
            }
            default: {
              break;
            }
          }
          // alert(`Payment Status: ${status}.`);
          this.setState({
            showAlert2: true,
            strHeading2: "Payment Status",
            strToShow2: status
          });
        })
        .catch(error => {
          // alert("Please enter a valid Envelope ID!");
          // this.setState({
          //   showAlert2: true,
          //   strHeading2: "Error",
          //   strToShow2: "Please enter a valid Envelope ID!",
          //   alertType2: "danger"
          // });
          console.log(error);
        });
    }
  }

  handleSubmit(event: any) {
    event.preventDefault();
  }

  handleClickSubmit(event: any) {
    /* The actual action. */
    // $$$ alert("Pay $" + this.state.Amount + " to " + this.state.Recipient + " !");
    var doc = new jsPDF();
    doc.setFont("times");
    doc.setFontSize(25);

    var centeredText = function(text: string, y: number) {
      var textWidth =
        (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
      doc.text(textOffset, y, text);
    };

    centeredText("INVOICE", 20);

    doc.setFontSize(16);
    doc.text(20, 30, "Bill To: ");
    doc.text(45, 30, this.state.Recipient);

    doc.text(20, 40, "Amount: ");
    var moneyStr = String(Converter.default(this.state.Amount));
    // eslint-disable-next-line
    var lineOffset = 0;
    if (moneyStr.length < lineLimit) {
      doc.text(45, 46, moneyStr);
      lineOffset++;
    } else {
      var moneyArr = moneyStr.split(" ");
      var toAddArr = [""];
      var toAdd = "";

      for (let i = 0; i < moneyArr.length; i++) {
        if ((toAdd + moneyArr[i] + " ").length < lineLimit) {
          toAdd = toAdd + moneyArr[i] + " ";
        } else {
          toAddArr.push(toAdd);
          toAdd = moneyArr[i] + " ";
        }
      }
      if (toAdd) {
        toAddArr.push(toAdd);
      }

      for (let i = 1; i < toAddArr.length; i++) {
        doc.text(45, 46 + (i - 1) * 5, toAddArr[i]);
        lineOffset++;
      }
    }

    doc.text(20, doc.internal.pageSize.height - 28, "Signature: ");

    doc.rect(
      18,
      23,
      doc.internal.pageSize.width - 36,
      doc.internal.pageSize.height - 46,
      "S"
    );
    var str64 = doc.output("datauri");
    console.log(str64);

    axios
      .post("/createpayment", {
        Recipient: this.state.Recipient,
        Email: this.state.Email,
        Amount: this.state.Amount,
        accessToken: this.state.accessToken,
        pdf64: str64
      })
      .then(response => {
        console.log("envelopeId: " + response.data.envelopeId);

        // alert(
        //   `Invoice sent! Unsigned invoice proof downloaded!\nEnvelope ID: ${
        //     response.data.envelopeId
        //   }`
        // );
        this.setState({
          lastenvelopeId: response.data.envelopeId,
          showAlert: true,
          strHeading: "Invoice sent!",
          strToShow: `Unsigned invoice proof downloaded! Envelope ID: ${
            response.data.envelopeId
          }`,
          alertType: "success"
        });

        var doc1 = new jsPDF();
        doc1.setFont("times");
        doc1.setFontSize(25);

        var centeredText1 = function(text: string, y: number) {
          var textWidth =
            (doc1.getStringUnitWidth(text) * doc1.internal.getFontSize()) /
            doc1.internal.scaleFactor;
          var textOffset = (doc1.internal.pageSize.width - textWidth) / 2;
          doc1.text(textOffset, y, text);
        };

        centeredText1("UNSIGNED INVOICE PROOF", 20);

        doc1.setFontSize(16);
        doc1.text(20, 30, "Bill To: ");
        doc1.text(45, 30, this.state.Recipient);

        doc1.text(20, 40, "Amount: ");
        var moneyStr1 = String(Converter.default(this.state.Amount));
        // eslint-disable-next-line
        var lineOffset1 = 0;
        if (moneyStr1.length < lineLimit) {
          doc1.text(45, 46, moneyStr1);
          lineOffset1++;
        } else {
          var moneyArr1 = moneyStr1.split(" ");
          var toAddArr1 = [""];
          var toAdd1 = "";

          for (let i = 0; i < moneyArr1.length; i++) {
            if ((toAdd1 + moneyArr1[i] + " ").length < lineLimit) {
              toAdd1 = toAdd1 + moneyArr1[i] + " ";
            } else {
              toAddArr1.push(toAdd1);
              toAdd1 = moneyArr1[i] + " ";
            }
          }
          if (toAdd1) {
            toAddArr1.push(toAdd1);
          }

          for (let i = 1; i < toAddArr1.length; i++) {
            doc1.text(45, 46 + (i - 1) * 5, toAddArr1[i]);
            lineOffset1++;
          }
        }

        doc1.text(
          20,
          doc1.internal.pageSize.height - 28,
          "Signature: Unsigned (Awaiting Signature)"
        );

        doc1.rect(
          18,
          23,
          doc.internal.pageSize.width - 36,
          doc.internal.pageSize.height - 46,
          "S"
        );
        doc1.text(45, 40, moneyFormatter.format(this.state.Amount));

        doc1.save("Your Unsigned Invoice Proof.pdf");
      })
      .catch(error => {
        console.log(error);
        this.setState({
          showAlert: true,
          strHeading: "Empty Input",
          strToShow: "Please enter valid recipient and amount information!",
          alertType: "warning"
        });
      });

    event.preventDefault();
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get("t");
    var decry = "";

    if (myParam) {
      decry = symCrypt.symDecrypt(
        myParam.replace(/ /g, "+"),
        config.dsClientSecret
      );
    }
    this.setState({ accessToken: decry });
  }

  render() {
    const accessToken = this.state.accessToken;
    if (!accessToken || accessToken === "null") {
      return (
        <div className="App-header">
          <p>Welcome to Auto-Invoicer</p>
          <header className="App-header2">Powered by DocuSign APIs</header>
          <br />
          <Button
            variant="primary"
            onClick={this.handleClickLogIn}
            style={{ width: "600px" }}
          >
            Log into your DocuSign account
          </Button>
        </div>
      );
    } else {
      return (
        <div className="App-header">
          Auto-Invoicer
          <header className="App-header4">
            <p>Powered by DocuSign APIs</p>
            <br />
            <Alert
              className="Main-Alert"
              show={this.state.showAlert}
              variant={this.state.alertType}
              onClose={this.handleCloseAlert}
              dismissible
            >
              <Alert.Heading className="Alert-Heading">
                {this.state.strHeading}
              </Alert.Heading>
              <p>{this.state.strToShow}</p>
            </Alert>

            <header className="App-header3">
              <Form name="Auto-Invoicer" onSubmit={this.handleSubmit}>
                <Form.Group controlId="formRecipient">
                  <Form.Label>Recipient Name</Form.Label>
                  <Form.Control
                    onChange={this.handleChangeRecipient}
                    placeholder="Enter your invoice recipient's name here"
                    style={{ width: "600px", height: "30px" }}
                    type="text"
                  />
                </Form.Group>

                <Form.Group controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    onChange={this.handleChangeEmail}
                    placeholder="Enter your invoice recipient's email here"
                    style={{ width: "600px", height: "30px" }}
                    type="email"
                  />
                </Form.Group>
                <Form.Group controlId="formAmount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    onChange={this.handleChangeAmount}
                    placeholder="Enter a value greater than $0.00"
                    style={{ width: "600px", height: "30px" }}
                    type="number"
                  />
                </Form.Group>
                <Button
                  onClick={this.handleClickSubmit}
                  style={{ width: "600px" }}
                >
                  Submit
                </Button>
                <br />
                <br />
                <br />
                <br />
                <Alert
                  className="Main-Alert"
                  show={this.state.showAlert2}
                  variant={this.state.alertType2}
                  onClose={this.handleCloseAlert2}
                  dismissible
                >
                  <Alert.Heading className="Alert-Heading">
                    {this.state.strHeading2}
                  </Alert.Heading>
                  <p>{this.state.strToShow2}</p>
                </Alert>
                <Form.Group controlId="formEnvelopeID">
                  <Form.Label>Check Status</Form.Label>
                  <Form.Control
                    onChange={this.handleRecordStatus}
                    placeholder="Enter the invoice's Envelope ID"
                    style={{ width: "600px", height: "30px" }}
                    type="text"
                  />
                </Form.Group>
                <Button
                  onClick={this.handleCheckStatus}
                  variant="info"
                  style={{ width: "600px" }}
                >
                  Check an invoice by the entered Envelope ID
                </Button>
                <br />

                <Button
                  onClick={this.handleCheckLastEnvelope}
                  style={{ width: "600px" }}
                  variant="success"
                >
                  Check the most recent invoice sent
                </Button>
                <br />
                <br />
                <br />

                <Button
                  onClick={this.handleClickLogout}
                  variant="danger"
                  style={{ width: "600px" }}
                >
                  Log Out
                </Button>
              </Form>
              <br />
              <br />
              <br />
            </header>
          </header>
        </div>
      );
    }
  }
}

export default App;
