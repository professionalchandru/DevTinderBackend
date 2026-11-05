const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, body, subject) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${body}</h1>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "TEXT_FORMAT_BODY",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `${subject}`,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

const run = async (fromEmail, toEmail, body, subject) => {
  //here i can get the from and to email address of the users. but for now hardcoding the email address. For aws sandbox mode both email address nees to be verified in aws ses.
  console.log("fromEmail", fromEmail);
  console.log("toEmail", toEmail);
  const sendEmailCommand = createSendEmailCommand(
    process.env.TO_EMAIL,
    process.env.FROM_EMAIL,
    body,
    subject,
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };
