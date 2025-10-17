import { EmailService } from "../broadcast/emailService.js";

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

    const result = await emailService.sendEmail({
      to: "danishan089@gmail.com",
      subject: "Test Email",
      text: "Hello! This is a test email from Node.js",
      html: "<p>Hello! This is a <b>test email</b> from Node.js</p>",
    });

    console.log("Email sent successfully:", result.messageId);
    return result;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
}
