import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const translate = (key, lang = "en", variables = {}) => {
  const localePath = path.join(__dirname, `${lang}.json`);
  const translations = JSON.parse(fs.readFileSync(localePath, "utf-8"));

  let text = translations[key] || key;

  // Replace variables dynamically
  Object.keys(variables).forEach((varKey) => {
    text = text.replace(`{{${varKey}}}`, variables[varKey]);
  });

  return text;
};
