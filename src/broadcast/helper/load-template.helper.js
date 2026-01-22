import Handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getLocalizedTemplate = (
  templateName,
  variables = {},
  language = "en",
) => {
  const translationPath = path.join(
    __dirname,
    "../../translations/email",
    `${language}.json`,
  );

  const templatePath = path.join(
    __dirname,
    "../templets",
    `${templateName}.html`,
  );

  // Load files
  const locale = JSON.parse(fs.readFileSync(translationPath, "utf8"));
  const templateHtml = fs.readFileSync(templatePath, "utf8");

  /**
   * Translation helper
   * Usage:
   *   {{t "key"}}
   *   {{t "key" name=name otp=otp}}
   */
  Handlebars.registerHelper("t", function (key, options) {
    let text = locale[key] ?? key;

    // Merge root variables + hash variables
    const context = {
      ...options.data?.root,
      ...options.hash,
    };

    // Replace {{var}} placeholders inside translations
    Object.entries(context).forEach(([k, v]) => {
      text = text.replace(new RegExp(`{{\\s*${k}\\s*}}`, "g"), v);
    });

    return new Handlebars.SafeString(text);
  });

  const template = Handlebars.compile(templateHtml);

  return template(variables);
};
