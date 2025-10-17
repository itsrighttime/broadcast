# Developer Guide: `@itsrighttime/broadcast`

## Overview

`@itsrighttime/broadcast` is a robust email service package designed for sending emails with advanced features such as attachments, priority levels, CC/BCC, templating support, and custom HTML/CSS emails. It provides a structured way to send and schedule emails using **Nodemailer** while ensuring ease of integration.

## Installation

```bash
npm install @itsrighttime/broadcast
```

## Configuration

```javascript
import { EmailService } from "@itsrighttime/broadcast";

const emailService = new EmailService({
  host: "smtp.example.com",
  port: 465, // 465 for SSL, 587 for TLS
  secure: true, // true for 465, false for other ports
  user: "your-email@example.com",
  pass: "your-email-password",
  fromName: "Your Company",
  fromEmail: "noreply@example.com",
});
```

## `EmailService` Constructor Props

| Prop        | Type      | Default                         | Required | Rules / Notes                                       |
| ----------- | --------- | ------------------------------- | -------- | --------------------------------------------------- |
| `host`      | `string`  | `"mail.itsrighttime.group"`     | No       | SMTP server hostname.                               |
| `port`      | `number`  | `465`                           | No       | SMTP port: `465` for SSL, `587` for TLS/submission. |
| `secure`    | `boolean` | `true`                          | No       | `true` for SSL (465), `false` for TLS (587).        |
| `user`      | `string`  | —                               | Yes      | SMTP username for authentication.                   |
| `pass`      | `string`  | —                               | Yes      | SMTP password for authentication.                   |
| `fromName`  | `string`  | `"itsRIGHTtime"`                | No       | Default display name for sender.                    |
| `fromEmail` | `string`  | `"no-reply@itsrighttime.group"` | No       | Default sender email address.                       |
| `logger`    | `boolean` | `false`                         | No       | Enable internal Nodemailer logging.                 |
| `debug`     | `boolean` | `false`                         | No       | Enable debug mode for SMTP connection.              |

### Notes:

1. **SSL/TLS**:

   - Use `secure: true` for port `465` (SSL).
   - Use `secure: false` for port `587` (TLS/submission).

2. **TLS Options**:

   - `rejectUnauthorized: false` is applied by default to allow self-signed or Let’s Encrypt certificates.

3. **Logging**:

   - `logger` and `debug` are optional and useful for debugging SMTP connection issues.

## `sendEmail` Props

| Prop                 | Type                          | Default    | Required      | Rules / Notes                                                                                            |
| -------------------- | ----------------------------- | ---------- | ------------- | -------------------------------------------------------------------------------------------------------- |
| `to`                 | `string \| string[]`          | —          | Yes           | Recipient email(s).                                                                                      |
| `cc`                 | `string \| string[]`          | —          | No            | CC recipients.                                                                                           |
| `bcc`                | `string \| string[]`          | —          | No            | BCC recipients.                                                                                          |
| `subject`            | `string`                      | —          | Yes           | Subject of the email.                                                                                    |
| `text`               | `string`                      | —          | Conditionally | Only one content type can be used: `text`, `html+css`, or `templateName`.                                |
| `html`               | `string`                      | —          | Conditionally | Must be provided if `css` is used.                                                                       |
| `css`                | `string`                      | —          | No            | Inline CSS for `html` content. Cannot be used alone.                                                     |
| `templateName`       | `string`                      | —          | Conditionally | Name of a predefined template. Only one content type allowed at a time.                                  |
| `variables`          | `object`                      | `{}`       | No            | Template variables for `templateName`. Ignored if `text` or `html` is used.                              |
| `language`           | `string`                      | `"en"`     | No            | Template language. Ignored if `text` or `html` is used.                                                  |
| `replyTo`            | `string`                      | —          | No            | Reply-to email address.                                                                                  |
| `attachments`        | `Array<Object>`               | `[]`       | No            | Array of attachments. Each attachment object: `{ filename: string, path: string, contentType?: string }` |
| `priority`           | `"high" \| "normal" \| "low"` | `"normal"` | No            | Email priority.                                                                                          |
| `requestReadReceipt` | `boolean`                     | `false`    | No            | Request a read receipt from recipient.                                                                   |

### Notes on Content Validation

- **Mutually exclusive** content types: only **one** of the following should be present:

  1. `text`
  2. `html` (with optional `css`)
  3. `templateName`

- If `css` is provided, `html` **must** be present.
- If validation fails, the service throws an error with a descriptive message.

## Examples

### 1. Simple Text Email

```javascript
await emailService.sendEmail({
  to: "recipient@example.com",
  subject: "Welcome!",
  text: "Thank you for joining our service.",
});
```

### 2. HTML + CSS Email

```javascript
await emailService.sendEmail({
  to: "recipient@example.com",
  subject: "Stylish Email",
  html: "<h1>Hello!</h1><p>This is a styled email.</p>",
  css: "h1 { color: blue; } p { font-size: 14px; }",
});
```

### 3. Using Templates

```javascript
await emailService.sendEmail({
  to: "user@example.com",
  subject: "Your OTP Code",
  templateName: "otp",
  variables: { name: "John Doe", otp: "123456" },
});
```

### Attachments, CC/BCC, Priority & Read Receipt

```javascript
await emailService.sendEmail({
  to: "user@example.com",
  cc: ["manager@example.com"],
  bcc: ["ceo@example.com"],
  subject: "Project Update",
  text: "Here’s the latest update.",
  attachments: [{ filename: "report.pdf", path: "./files/report.pdf" }],
  priority: "high",
  requestReadReceipt: true,
});
```

## Scheduling Emails

```javascript
import { emailSchedule } from "@itsrighttime/broadcast";

emailSchedule(new Date(Date.now() + 60000), {
  to: "user@example.com",
  subject: "Reminder: Meeting in 1 hour",
  text: "Don't forget your meeting at 3 PM.",
});
```

## Error Handling

```javascript
try {
  await emailService.sendEmail({ css: "body { color: red; }" });
} catch (error) {
  console.error("Failed to send email:", error.message);
  // Output: "CSS cannot be used without HTML content."
}
```

## Conclusion

`@itsrighttime/broadcast` provides a flexible, scalable, and robust solution for sending emails in Node.js:

- Supports **plain text, HTML+CSS, and template-based emails**
- Handles **attachments, CC/BCC, priority, and read receipt**
- Enables **email scheduling**
- Validates **content and CSS usage** automatically
