# `@itsrighttime/broadcast` Examples

This document demonstrates how to use the `EmailService` and template utilities for different email sending scenarios.

## 1. Basic Text Email

```javascript
import { EmailService } from "@itsrighttime/broadcast";

const emailService = new EmailService({
  user: "no-reply@itsrighttime.group",
  pass: "your-password",
});

```

```javascript
import { EmailService } from "@itsrighttime/broadcast";

const emailService = new EmailService({
  host: "mail.itsrighttime.group",
  port: 587,
  secure: false, // TLS
  user: "no-reply@itsrighttime.group",
  pass: "your-password",
});

await emailService.sendEmail({
  to: "recipient@example.com",
  subject: "Hello!",
  text: "This is a simple text email from Node.js",
});
```

## 2. HTML Email with Optional CSS

```javascript
import { EmailService } from "@itsrighttime/broadcast";
import fs from "fs";

const emailService = new EmailService({
  user: "no-reply@itsrighttime.group",
  pass: "your-password",
});

const htmlContent = `<h1>Welcome!</h1><p>This is a <b>HTML</b> email.</p>`;
const cssContent = `h1 { color: blue; } p { font-size: 16px; }`;

await emailService.sendEmail({
  to: "recipient@example.com",
  subject: "HTML Email Example",
  html: htmlContent,
  css: cssContent, // optional
});
```

**Note:** `css` can only be used if `html` is provided.

## 3. Using Email Templates

```javascript
import {
  EmailService,
  getTemplatesName,
  getEmailTemplateInfo,
} from "@itsrighttime/broadcast";

const emailService = new EmailService({
  user: "no-reply@itsrighttime.group",
  pass: "your-password",
});

console.log(getTemplatesName()); // ["welcome", "otp", "reminder", ...]

const templateInfo = getEmailTemplateInfo("otp");
console.log(templateInfo);
// { templateName: 'otp', requiredVariables: ['name', 'otp_code'] }

await emailService.sendEmail({
  to: "user@example.com",
  subject: "Your OTP Code",
  templateName: "otp",
  variables: { name: "John Doe", otp_code: "123456" },
});
```

## 4. Email with Attachments

```javascript
await emailService.sendEmail({
  to: "recipient@example.com",
  subject: "Invoice Attached",
  text: "Please find the attached invoice.",
  attachments: [
    {
      filename: "invoice.pdf",
      path: "./files/invoice.pdf",
    },
  ],
});
```

## 5. CC and BCC

```javascript
await emailService.sendEmail({
  to: "user@example.com",
  cc: ["manager@example.com"],
  bcc: ["ceo@example.com"],
  subject: "Project Update",
  text: "Here's the latest project update.",
});
```

## 6. High-Priority Email with Read Receipt

```javascript
await emailService.sendEmail({
  to: "urgent@example.com",
  subject: "Critical Issue Alert 🚨",
  text: "This is an urgent issue that requires immediate attention.",
  priority: "high",
  requestReadReceipt: true,
});
```

## 7. Scheduling Emails

```javascript
const emailService = new EmailService({
  user: "no-reply@itsrighttime.group",
  pass: "your-password",
});

emailService.scheduleEmail(new Date(Date.now() + 60000), {
  to: "user@example.com",
  subject: "Reminder: Meeting in 1 hour!",
  text: "Don't forget your meeting at 3 PM.",
});
```

## 8. Error Handling

```javascript
try {
  await emailService.sendEmail({
    to: "invalid-email",
    subject: "Test Email",
    text: "This will fail.",
  });
} catch (error) {
  console.error("Failed to send email:", error.message);
}
```

This `example.md` covers:

- Simple text email
- HTML email with CSS
- Using predefined templates
- Attachments
- CC/BCC
- High-priority and read receipts
- Scheduled emails
- Error handling
