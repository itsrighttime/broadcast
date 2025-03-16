import { BadRequestError } from "@itsrighttime/utils";

const emailTemplates = {
  welcome: ["name", "userId", "password_link"],
  otp: ["name", "otp_code"],
  reminder: ["name", "event", "event_date", "reminder_link"],
  promotion: ["name", "discount_code", "expiry_date", "promotion_link"],
  "password-reset": ["name", "reset_link"],
  "account-verification": ["name", "verification_link"],
  "subscription-update": ["name", "subscription_status", "update_link"],
};

export const getTemplatesName = () => {
  return Object.keys(emailTemplates);
};

/**
 * Get the template name and required variables
 * @param {string} templateKey - The template key (e.g., "welcome", "otp").
 * @returns {Object} { templateName, requiredVariables }
 */
export const getEmailTemplateInfo = (templateKey) => {
  if (!emailTemplates[templateKey]) {
    throw new BadRequestError(`Template "${templateKey}" not found.`);
  }

  return {
    templateName: templateKey,
    requiredVariables: emailTemplates[templateKey],
  };
};

// Example Usage:
// console.log(getEmailTemplateInfo("welcome"));
// Output: { templateName: 'welcome', requiredVariables: [ 'name', 'userId', 'password_link' ] }
