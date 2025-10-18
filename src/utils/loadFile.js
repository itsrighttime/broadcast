import fs from "fs/promises";
import path from "path";

/**
 * Load a file from a given location.
 * @param {string} filePath - Relative or absolute path to the file.
 * @returns {Promise<string>} - Resolves to file content as string.
 */
export async function loadFile(filePath) {
  try {
    const absolutePath = path.resolve(filePath);
    const content = await fs.readFile(absolutePath, "utf-8");
    return content;
  } catch (err) {
    console.error(`Error reading file at ${filePath}:`, err);
    throw err;
  }
}

// E:\itsRIGHTtime\LandingPages\itsRIGHTtime\itsrighttime_server\src\services\emailContent\html\registration.html
