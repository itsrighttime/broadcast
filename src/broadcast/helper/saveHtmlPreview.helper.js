import fs from "fs";
import path from "path";

export function saveHtmlPreview({ html, subject }) {
  const rootDir = process.cwd();
  const previewsDir = path.join(rootDir, "email-previews");

  if (!fs.existsSync(previewsDir)) {
    fs.mkdirSync(previewsDir, { recursive: true });
  }

  const safeSubject = subject.replace(/[^a-z0-9]/gi, "_").toLowerCase();

  const filename = `${safeSubject}-${new Date()
    .toISOString()
    .replace(/[:.]/g, "-")}.html`;

  const filePath = path.join(previewsDir, filename);

  fs.writeFileSync(filePath, html, "utf8");

  return filePath;
}
