# Developer Guide: `@itsrighttime/broadcast`

## Overview

`@itsrighttime/broadcast` is a robust email service package designed for sending emails with advanced features such as attachments, priority levels, CC/BCC, and templating support. It provides a structured way to send and schedule emails using **Nodemailer** while ensuring ease of integration.

## Installation

To install the package, use:

```sh
npm install @itsrighttime/broadcast
```

## Configuration

Before using the service, you need to configure the email settings. The `EmailService` class requires SMTP credentials for proper setup.

### Example Configuration:

```javascript
import { EmailService } from "@itsrighttime/broadcast";

const emailService = new EmailService({
  host: "smtp.example.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  user: "your-email@example.com",
  pass: "your-email-password",
  fromName: "Your Company",
  fromEmail: "noreply@example.com",
});
```

## Sending an Email

The `sendEmail` method allows sending emails with various options.

### Example:

```javascript
await emailService.sendEmail({
  to: "recipient@example.com",
  subject: "Welcome to Our Service",
  text: "Thank you for joining us!",
  html: "<h1>Welcome!</h1><p>We're glad to have you.</p>",
  attachments: [
    {
      filename: "file.pdf",
      path: "./path/to/file.pdf",
    },
  ],
  priority: "high",
  requestReadReceipt: true,
});
```

## Using Email Templates

To use predefined email templates:

```javascript
await emailService.sendEmail({
  to: "user@example.com",
  subject: "Your OTP Code",
  templateName: "otp",
  variables: { name: "John Doe", otp: "123456" },
});
```

## Scheduling Emails

You can schedule emails to be sent at a specific date and time.

```javascript
import { emailSchedule } from "@itsrighttime/broadcast";

emailSchedule(new Date(Date.now() + 60000), {
  to: "user@example.com",
  subject: "Reminder: Meeting in 1 hour!",
  text: "Don't forget your meeting at 3 PM.",
});
```

## Error Handling

The service logs email delivery status using a custom logger. If an email fails, it will throw an error:

```javascript
try {
  await emailService.sendEmail({ to: "invalid-email", subject: "Test" });
} catch (error) {
  console.error("Failed to send email:", error.message);
}
```

## Conclusion

`@itsrighttime/broadcast` provides an easy-to-use and scalable solution for handling email notifications. By leveraging **Nodemailer**, it allows seamless integration into any Node.js application.

For any issues, refer to the package documentation or raise an issue on GitHub.

---


