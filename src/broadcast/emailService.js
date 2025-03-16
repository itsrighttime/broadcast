import nodemailer from "nodemailer";
import schedule from "node-schedule";
import juice from "juice";
import fs from "fs";
import path from "path";
import { getLocalizedTemplate } from "./helper/load-template.helper.js";
import { createLoggerManager } from "@itsrighttime/utils";
import { serviceName } from "../utils/serviceName.js";

export const myLogger = createLoggerManager(serviceName);

/**
 * EmailService class for sending emails with configurable SMTP settings.
 * Creates an instance of EmailService.
 * @param {Object} config - Configuration for the email service.
 * @param {string} config.host - SMTP server host.
 * @param {number} config.port - SMTP server port.
 * @param {boolean} config.secure - Whether to use a secure connection.
 * @param {string} config.user - SMTP username.
 * @param {string} config.pass - SMTP password.
 * @param {string} config.fromName - Default sender name.
 * @param {string} config.fromEmail - Default sender email address.
 *
 * Use it
 */
export class EmailService {
  constructor({ host, port, secure, user, pass, fromName, fromEmail }) {
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    this.fromName = fromName;
    this.fromEmail = fromEmail;
  }

  /**
   * Send an email with advanced features like CC, BCC, attachments, and priority.
   * @param {Object} options - Email options.
   * @param {string|string[]} options.to - Recipient(s).
   * @param {string|string[]} [options.cc] - CC recipient(s).
   * @param {string|string[]} [options.bcc] - BCC recipient(s).
   * @param {string} options.subject - Email subject.
   * @param {string} [options.text] - Plain text email body.
   * @param {string} [options.html] - HTML email body.
   * @param {string} [options.replyTo] - Reply-To email address.
   * @param {Array} [options.attachments] - Array of attachment objects.
   * @param {string} [options.priority] - Email priority ('high', 'normal', 'low').
   * @param {boolean} [options.requestReadReceipt] - Request read receipt.
   * @param {string} [options.text] - Email templete Name ('welcome', 'otp', 'reminder').
   * @param {Object} [options] - Templete Variables ({'name': 'Danishan'}).
   * @returns {Promise<Object>} - Result of email sending.
   */
  async sendEmail({
    to,
    cc,
    bcc,
    subject,
    text,
    html,
    replyTo,
    attachments = [],
    priority = "normal",
    requestReadReceipt = false,
    templateName = null,
    variables = {},
    language = "en",
  }) {
    try {
      let finalHtml = html;
      if (templateName) {
        const templateHtml = getLocalizedTemplate(
          templateName,
          variables,
          language
        );
        const cssPath = path.join(__dirname, "templates", "style.css");
        const css = fs.readFileSync(cssPath, "utf8");
        finalHtml = juice.inlineContent(templateHtml, css);
      }

      const mailOptions = {
        from: `${this.fromName} <${this.fromEmail}>`,
        to,
        cc,
        bcc,
        subject,
        text,
        html: finalHtml,
        replyTo,
        priority,
        attachments,
        headers: requestReadReceipt
          ? { "Disposition-Notification-To": this.fromEmail }
          : {},
      };

      const result = await this.transporter.sendMail(mailOptions);
      myLogger.info(`Email sent to ${to} | Message ID: ${result.messageId}`);
      return result;
    } catch (error) {
      myLogger.error(`Email sending failed: ${error.message}`);
      throw new Error("Email sending failed.");
    }
  }

  /**
   * Send an email with advanced features like CC, BCC, attachments, and priority.
   * @param {Date} options - Email options.
   * @param {Object} options - Email options.
   * @param {string|string[]} options.to - Recipient(s).
   * @param {string|string[]} [options.cc] - CC recipient(s).
   * @param {string|string[]} [options.bcc] - BCC recipient(s).
   * @param {string} options.subject - Email subject.
   * @param {string} [options.text] - Plain text email body.
   * @param {string} [options.html] - HTML email body.
   * @param {string} [options.replyTo] - Reply-To email address.
   * @param {Array} [options.attachments] - Array of attachment objects.
   * @param {string} [options.priority] - Email priority ('high', 'normal', 'low').
   * @param {boolean} [options.requestReadReceipt] - Request read receipt.
   * @param {string} [options.text] - Email templete Name ('welcome', 'otp', 'reminder').
   * @param {Object} [options] - Templete Variables ({'name': 'Danishan'}).
   * @returns {Promise<Object>} - Result of email sending.
   */
  scheduleEmail(date, options) {
    schedule.scheduleJob(date, async () => {
      await this.sendEmail(options);
    });
  }
}

/*

// Sending a Basic Email
await sendEmail({
  to: "user@example.com",
  subject: "Hello!",
  text: "This is a test email.",
  html: "<h1>Hello!</h1><p>This is a test email.</p>",
});


// Sending an Email with CC & BCC
await sendEmail({
  to: "user@example.com",
  cc: ["manager@example.com"],
  bcc: ["ceo@example.com"],
  subject: "Project Update",
  text: "Here's the latest project update.",
});

//  Sending an Email with Attachments
await sendEmail({
  to: "user@example.com",
  subject: "Invoice Attached",
  text: "Please find the invoice attached.",
  attachments: [
    {
      filename: "invoice.pdf",
      path: "./files/invoice.pdf",
    },
  ],
});

// Sending a High-Priority Email with Read Receipt
await sendEmail({
  to: "urgent@example.com",
  subject: "Critical Issue Alert 🚨",
  text: "This is an urgent issue that needs immediate attention.",
  priority: "high",
  requestReadReceipt: true,
});



// Usage Example
emailSchedule(new Date(Date.now() + 60000), {
  to: "user@example.com",
  subject: "Reminder: Meeting in 1 hour!",
  text: "Don't forget your meeting at 3 PM.",
});


*/
