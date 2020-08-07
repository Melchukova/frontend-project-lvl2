import fs from 'fs';
import { extname, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const readFile = (path) => fs.readFileSync(path, 'utf-8');

const getFormat = (path) => extname(path).substr(1);

const buildPath = (relativePath) => join(__dirname, '..', relativePath);

export { buildPath, readFile, getFormat };
