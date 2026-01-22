# `@itsrighttime/broadcast` Examples

This document demonstrates how to use the `EmailService` and template utilities for different email sending and preview scenarios.

## 1. Basic Text Email

```javascript
import { EmailService } from "@itsrighttime/broadcast";

const emailService = new EmailService({
  user: "no-reply@itsrighttime.group",
  pass: "your-password",
});
```

```javascript
await emailService.sendEmail({
  to: "recipient@example.com",
  subject: "Hello!",
  text: "This is a simple text email from Node.js",
});
```

## 2. HTML Email with Optional CSS

```javascript
import { EmailService } from "@itsrighttime/broadcast";

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
  css: cssContent,
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

console.log(getTemplatesName());
// ["welcome", "otp", "reminder", ...]

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
  subject: "Critical Issue Alert ",
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
    css: "body { color: red; }",
  });
} catch (error) {
  console.error("Failed to send email:", error.message);
  // CSS cannot be used without HTML content.
}
```

## 9. Preview Email Output (No Send) 

Generate the final email output **without sending it**.

```javascript
const result = await emailService.sendEmail({
  to: "test@example.com",
  subject: "Welcome Email Preview",
  templateName: "welcome",
  variables: { name: "Danishan" },
  previewOnly: true,
});

console.log(result.preview); // true
console.log(result.email.html); // Rendered HTML
```

## 10. Preview & Save Email as HTML ⭐ NEW

Save the rendered email output as a `.html` file at the **project root**.

```javascript
const result = await emailService.sendEmail({
  to: "test@example.com",
  subject: "OTP Email Preview",
  templateName: "otp",
  variables: { otp_code: "123456" },
  previewOnly: true,
  savePreview: true,
});

console.log(result.previewPath);
// project-root/email-previews/otp-2026-01-22T10-30-00.html
```

## 11. Understanding Return Values ⭐ NEW

### Normal Send

```javascript
const result = await emailService.sendEmail({
  to: "user@example.com",
  subject: "Welcome",
  text: "Hello!",
});

console.log(result.messageId);
```

➡ Returns **Nodemailer `SendMailResult`**

### Preview Mode

```javascript
const result = await emailService.sendEmail({
  to: "user@example.com",
  subject: "Preview Only",
  text: "This will not be sent",
  previewOnly: true,
});

console.log(result.email.text);
```

➡ Returns rendered email object (no SMTP call)

## Summary

This `examples.md` demonstrates:

- Simple text emails
- HTML emails with inline CSS
- Template-based emails
- Attachments
- CC/BCC
- Priority & read receipts
- Scheduled emails
- Error handling
- **Email preview without sending**
- **HTML export to project root**
- **Clear return values**
