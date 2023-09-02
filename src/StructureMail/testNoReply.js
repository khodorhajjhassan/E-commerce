import { sendEmail } from "../utils/sendEmail.js";

// Example usage
const someFunction = async () => {
  try {
    const to = "ausmi.natalli@gmail.com";
    const subject = "Hello from Nodemailer";
    const message =
      "This is a test email sent from Nodemailer in a Node.js app.";
    const result = await sendEmail(to, subject, message);
    console.log(result); // Email sent successfully!
  } catch (error) {
    console.log(error); // Failed to send email!
  }
};

someFunction();

//How to test ... go to C:\bellesole\src\StructureMail> using cd => node testNoReply.js
//note:you need to replace env variables in sendEmail.js to actual variable
