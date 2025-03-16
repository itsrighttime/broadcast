import dotenv from "dotenv";

dotenv.config();

export const emailConfig = {
  SMTP_HOST: process.env.SMTP_HOST || "smtp.example.com",
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_SECURE: process.env.SMTP_SECURE === "true", // true for 465, false for others
  SMTP_USER: process.env.SMTP_USER || "your-email@example.com",
  SMTP_PASS: process.env.SMTP_PASS || "your-email-password",
  FROM_NAME: process.env.FROM_NAME || "Your Company",
  FROM_EMAIL: process.env.FROM_EMAIL || "no-reply@example.com",
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || "your_sendgrid_api_key",
  AWS_SES_ACCESS_KEY: process.env.AWS_SES_ACCESS_KEY || "your_aws_access_key",
  AWS_SES_SECRET_KEY: process.env.AWS_SES_SECRET_KEY || "your_aws_secret_key",
  DEFAULT_FROM_EMAIL: "no-reply@yourdomain.com",
};
