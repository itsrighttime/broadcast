# Developer Guide: `@itsrighttime/broadcast`

## Overview

`@itsrighttime/broadcast` is a robust email service package designed for sending emails with advanced features such as attachments, priority levels, CC/BCC, templating support, and custom HTML/CSS emails.

It also supports **email preview mode**, allowing developers to **generate, inspect, and save the final rendered email output (HTML)** without sending it.

The service is built on **Nodemailer** and designed for clean integration into modern **ESM (ES6)** Node.js applications.

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

### Notes

1. **SSL/TLS**
   - Use `secure: true` for port `465`
   - Use `secure: false` for port `587`

2. **TLS Options**
   - `rejectUnauthorized: false` is enabled by default to allow self-signed or Let’s Encrypt certificates.

3. **Logging**
   - `logger` and `debug` are useful for diagnosing SMTP issues.

## `sendEmail` Props

| Prop                 | Type                          | Default    | Required      | Rules / Notes                                                   |
| -------------------- | ----------------------------- | ---------- | ------------- | --------------------------------------------------------------- |
| `to`                 | `string \| string[]`          | —          | Yes           | Recipient email(s).                                             |
| `cc`                 | `string \| string[]`          | —          | No            | CC recipients.                                                  |
| `bcc`                | `string \| string[]`          | —          | No            | BCC recipients.                                                 |
| `subject`            | `string`                      | —          | Yes           | Subject of the email.                                           |
| `text`               | `string`                      | —          | Conditionally | Plain text email body.                                          |
| `html`               | `string`                      | —          | Conditionally | HTML email body. Required if `css` is provided.                 |
| `css`                | `string`                      | —          | No            | Inline CSS for `html`. Cannot be used alone.                    |
| `templateName`       | `string`                      | —          | Conditionally | Name of a predefined template.                                  |
| `variables`          | `object`                      | `{}`       | No            | Template variables. Used only with `templateName`.              |
| `language`           | `string`                      | `"en"`     | No            | Template language.                                              |
| `replyTo`            | `string`                      | —          | No            | Reply-to email address.                                         |
| `attachments`        | `Array<Object>`               | `[]`       | No            | Attachments: `{ filename, path, contentType? }`.                |
| `priority`           | `"high" \| "normal" \| "low"` | `"normal"` | No            | Email priority.                                                 |
| `requestReadReceipt` | `boolean`                     | `false`    | No            | Request read receipt from recipient.                            |
| `previewOnly`        | `boolean`                     | `false`    | No            | **Generate email output without sending**.                      |
| `savePreview`        | `boolean`                     | `false`    | No            | Save rendered HTML email to disk when `previewOnly` is enabled. |

## Return Value of `sendEmail`

The `sendEmail` method returns **different response objects** depending on whether the email is **sent** or **previewed**.

### 1 Normal Send Mode (default)

When `previewOnly` is **false** (default), the email is sent using Nodemailer and the function returns the **Nodemailer `SendMailResult`**.

#### Return Type

```ts
Promise<{
  accepted: string[];
  rejected: string[];
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: {
    from: string;
    to: string[];
  };
  messageId: string;
}>;
```

#### Example

```javascript
const result = await emailService.sendEmail({
  to: "user@example.com",
  subject: "Welcome",
  text: "Hello!",
});

console.log(result.messageId);
```

#### Notes

- This object comes **directly from Nodemailer**
- Properties may vary slightly by transport

### 2 Preview Mode (`previewOnly: true`)

When `previewOnly` is **true**, the email is **not sent**.
Instead, the function returns the **fully rendered email output**.

#### Return Type

```ts
Promise<{
  preview: true;
  previewPath: string | null;
  email: {
    from: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    text?: string;
    html?: string;
  };
}>;
```

### Example: Preview Without Saving

```javascript
const result = await emailService.sendEmail({
  to: "test@example.com",
  subject: "Welcome Email",
  templateName: "welcome",
  previewOnly: true,
});

console.log(result.preview); // true
console.log(result.email.html); // rendered HTML
```

### Example: Preview With HTML Saved

```javascript
const result = await emailService.sendEmail({
  to: "test@example.com",
  subject: "OTP Email",
  templateName: "otp",
  variables: { otp: "123456" },
  previewOnly: true,
  savePreview: true,
});

console.log(result.previewPath);
// /project-root/email-previews/otp-2026-01-22T10-30-00.html
```

### 3 Return Value Summary

| Mode           | `previewOnly`          | Email Sent | Return Value                |
| -------------- | ---------------------- | ---------- | --------------------------- |
| Normal send    | `false`                | Yes        | Nodemailer `SendMailResult` |
| Preview        | `true`                 | No         | Rendered email object       |
| Preview + Save | `true` + `savePreview` | No         | Rendered email + file path  |

### Important Notes

- `previewOnly` **always bypasses SMTP sending**
- `savePreview` has **no effect** unless `previewOnly` is `true`
- `previewPath` will be `null` if `savePreview` is disabled or content is text-only

## TypeScript-Friendly Union Type (Optional)

```ts
type SendEmailResult =
  | Nodemailer.SendMailResult
  | {
      preview: true;
      previewPath: string | null;
      email: {
        from: string;
        to: string | string[];
        cc?: string | string[];
        bcc?: string | string[];
        subject: string;
        text?: string;
        html?: string;
      };
    };
```

## Content Validation Rules

- Exactly **one** content type must be used:
  1. `text`
  2. `html` (+ optional `css`)
  3. `templateName`

- If `css` is provided, `html` **must** be present.

- Validation errors throw descriptive exceptions.

## Email Preview & HTML Export (New Feature)

### What is Preview Mode?

Preview mode allows you to:

- Generate the **exact final email output**
- Inspect the HTML/text programmatically
- Save the rendered email as a `.html` file
- **Avoid sending the email**

### Preview Storage Location

When `savePreview: true` is used:

- HTML files are saved to the **project root**
- Directory name: `email-previews/`
- Path resolution uses `process.cwd()` (ESM-safe)

```
project-root/
 ├─ email-previews/
 │   ├─ welcome-2026-01-22T10-30-00.html
```

### Example: Preview Only (No Send)

```javascript
const preview = await emailService.sendEmail({
  to: "test@example.com",
  subject: "Welcome Email",
  templateName: "welcome",
  variables: { name: "Danishan" },
  previewOnly: true,
});

console.log(preview.email.html);
```

### Example: Preview + Save HTML File

```javascript
const preview = await emailService.sendEmail({
  to: "test@example.com",
  subject: "OTP Email",
  templateName: "otp",
  variables: { otp: "123456" },
  previewOnly: true,
  savePreview: true,
});

console.log("HTML saved at:", preview.previewPath);
```

## Examples

### Simple Text Email

```javascript
await emailService.sendEmail({
  to: "recipient@example.com",
  subject: "Welcome!",
  text: "Thank you for joining our service.",
});
```

### HTML + CSS Email

```javascript
await emailService.sendEmail({
  to: "recipient@example.com",
  subject: "Stylish Email",
  html: "<h1>Hello!</h1><p>This is a styled email.</p>",
  css: "h1 { color: blue; } p { font-size: 14px; }",
});
```

### Using Templates

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
emailService.scheduleEmail(new Date(Date.now() + 60000), {
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
  console.error(error.message);
  // "CSS cannot be used without HTML content."
}
```

## Conclusion

`@itsrighttime/broadcast` provides a flexible and production-ready email solution:

- Plain text, HTML+CSS, and template-based emails
- Attachments, CC/BCC, priority, and read receipts
- Email scheduling
- **Preview mode with HTML export**
- Strong validation and ESM compatibility
