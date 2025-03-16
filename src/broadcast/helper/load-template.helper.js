import Handlebars from "handlebars";
import fs from "fs";
import path from "path";

export const getLocalizedTemplate = (templateName, variables, language) => {
  const locale = JSON.parse(
    fs.readFileSync(path.join(__dirname, "locales", `${language}.json`), "utf8")
  );
  const templatePath = path.join(
    __dirname,
    "templates",
    `${templateName}.html`
  );
  const templateHtml = fs.readFileSync(templatePath, "utf8");

  const t = (key, data) => {
    let text = locale[key] || key;
    if (data) {
      Object.keys(data).forEach((k) => {
        text = text.replace(`{{${k}}}`, data[k]);
      });
    }
    return text;
  };

  const compiled = Handlebars.compile(templateHtml);
  return compiled({ ...variables, t });
};
