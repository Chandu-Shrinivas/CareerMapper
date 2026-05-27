import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const readJsonFile = (relativePath) => {
  const absolutePath = path.join(__dirname, '../', relativePath);
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
};
