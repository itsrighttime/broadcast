# Developer Guide: `@itsrighttime/broadcast`

## Overview

`@itsrighttime/broadcast` is a robust email service package designed for sending emails with advanced features such as attachments, priority levels, CC/BCC, and templating support. It provides a structured way to send and schedule emails using **Nodemailer** while ensuring ease of integration.

## Installation

```sh
npm install @itsrighttime/broadcast
```

## Exports

The library exports the following modules:

| Export                                                      | Type     | Description                                                                                  |
| ----------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------- |
| [`EmailService`](#emailservice-constructor)                 | Class    | Main class to configure SMTP and send emails with advanced options.                          |
| [`getTemplatesName`](#gettemplatesname)                     | Function | Returns an array of all available template names.                                            |
| [`getEmailTemplateInfo` ](#getemailtemplateinfotemplatekey) | Function | Returns required variables for a given template key. Throws error if template doesn’t exist. |

## `EmailService` Constructor [`2`](./docs/email-service.md)

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

**Notes:**

- **SSL/TLS**: Use `secure: true` for port `465` (SSL) or `secure: false` for port `587` (TLS).
- **TLS Options**: `rejectUnauthorized: false` is applied to allow self-signed or Let’s Encrypt certificates.
- **Logging**: `logger` and `debug` help debug SMTP connection issues.

## `sendEmail` Method

`sendEmail` supports sending email in **three mutually exclusive ways**:

1. **Simple text** (using `text`)
2. **External HTML & CSS** (using `html` and optional `css`)
3. **Template** (using `templateName` and `variables`)

**Rules:**

- Only **one content type** should be provided at a time.
- If `css` is provided, `html` must also be provided.

| Prop                 | Type      | Required      | Rules / Notes                                                                |                     |
| -------------------- | --------- | ------------- | ---------------------------------------------------------------------------- | ------------------- |
| `to`                 | `string`  | string[]      | Yes                                                                          | Recipient email(s). |
| `cc`                 | `string`  | string[]      | No                                                                           | CC recipients.      |
| `bcc`                | `string`  | string[]      | No                                                                           | BCC recipients.     |
| `subject`            | `string`  | Yes           | Email subject.                                                               |                     |
| `text`               | `string`  | Conditionally | Only used if not using `html`/`templateName`.                                |                     |
| `html`               | `string`  | Conditionally | Must provide if using external HTML & CSS.                                   |                     |
| `css`                | `string`  | No            | Optional CSS for `html`. Must have `html`.                                   |                     |
| `templateName`       | `string`  | Conditionally | Name of template to use (e.g., `"welcome"`).                                 |                     |
| `variables`          | `object`  | No            | Key-value pairs for template placeholders. Required if using `templateName`. |                     |
| `replyTo`            | `string`  | No            | Email for replies.                                                           |                     |
| `attachments`        | `Array`   | No            | Array of attachments `{filename, path}`.                                     |                     |
| `priority`           | `string`  | `"normal"`    | `"high"`, `"normal"`, `"low"` allowed.                                       |                     |
| `requestReadReceipt` | `boolean` | `false`       | Request read receipt.                                                        |                     |
| `language`           | `string`  | `"en"`        | Used for template localization (if implemented).                             |                     |

## Template Utility Functions

### `getTemplatesName()`

Returns a list of all available template names.

```javascript
import { getTemplatesName } from "@itsrighttime/broadcast";

console.log(getTemplatesName());
// Output: ["welcome", "otp", "reminder", "promotion", "password-reset", "account-verification", "subscription-update"]
```

### `getEmailTemplateInfo(templateKey)`

Returns the required variables for a given template key. Throws `BadRequestError` if the template does not exist.

```javascript
import { getEmailTemplateInfo } from "@itsrighttime/broadcast";

const info = getEmailTemplateInfo("welcome");
console.log(info);
/*
Output:
{
  templateName: 'welcome',
  requiredVariables: ['name', 'userId', 'password_link']
}
*/
```

**Rules:**

- Always provide a valid template key.
- `variables` passed to `sendEmail` **must include all required keys**.

## Scheduling Emails

```javascript
import { EmailService } from "@itsrighttime/broadcast";

const emailService = new EmailService({ user: "...", pass: "..." });

emailService.scheduleEmail(new Date(Date.now() + 60000), {
  to: "user@example.com",
  subject: "Meeting Reminder",
  text: "Don't forget your meeting at 3 PM.",
});
```
