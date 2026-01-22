import { EmailService } from "../broadcast/emailService.js";
import { loadFile } from "./loadFile.js";

// Create a reusable async function to send email
export async function sendMail() {
  try {
    const emailService = new EmailService({
      host: "mail.itsrighttime.group", // your mail server
      port: 465, // submission port
      secure: true, // false for 587, true for 465
      user: "no-reply",
      pass: "itsrighttimeA@!",
      fromName: "itsRIGHTtime",
      fromEmail: "no-reply@itsrighttime.group",
    });

    const htmlContent = await loadFile(
      "./src/utils/emailContent/html/registration.html",
    );
    const cssContent = await loadFile(
      "./src/utils/emailContent/css/registration.css",
    );

    const result = await emailService.sendEmail({
      to: "danishan089@gmail.com",
      subject: "Test Email",
      html: htmlContent,
      css: cssContent,
    });

    // const templateName = "otp";

    // const variables = {};
    // variables.name = "Danishan Farookh";
    // variables.otp = "859785";

    // const result = await emailService.sendEmail({
    //   to: "danishan089@gmail.com",
    //   subject: "letsSecure Account Confirmation - Your OTP Code",
    //   templateName,
    //   // text: `${variables.name} ${variables.otp_code}`,
    //   variables,
    // });

    console.log("Email sent successfully:", result.messageId);
    return result;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
}
