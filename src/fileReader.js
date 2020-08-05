import fs from 'fs';
import { extname, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const readFile = (path) => fs.readFileSync(path, 'utf-8');

const getFormat = (path) => extname(path).substr(1);

const buildPath = (name, ...directories) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return join(__dirname, '..', ...directories, name);
};

export { buildPath, readFile, getFormat };
