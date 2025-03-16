import juice from "juice";
import fs from "fs";
import path from "path";
import { translate } from "../../translations/email/email.translator.js";

export const loadTemplate = (templateName, lang = "en", variables = {}) => {
  const templatePath = path.join(
    __dirname,
    `../templates/${templateName}.html`
  );
  let htmlContent = fs.readFileSync(templatePath, "utf-8");

  // Translate all placeholders
  htmlContent = htmlContent.replace(/{{t\s+"(.*?)"}}/g, (_, key) =>
    translate(key, lang, variables)
  );

  const cssFiles = [
    "base.css",
    "responsive.css",
    "theme.css",
    "email-variables.css",
  ];
  let combinedCss = "";

  cssFiles.forEach((file) => {
    const cssPath = path.join(__dirname, `../styles/${file}`);
    combinedCss += fs.readFileSync(cssPath, "utf-8");
  });

  return juice.inlineContent(htmlContent, combinedCss);
};
