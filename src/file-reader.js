import fs from 'fs';
import { extname, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import getParser from './parsers.js';

const readFile = (path) => fs.readFileSync(path, 'utf-8');

const getParsedFileContent = (path) => {
  const content = readFile(path);

  const ext = extname(path);
  const format = ext.substr(1);

  const parse = getParser(format);

  return parse(content);
};

const getPath = (name, ...directories) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return join(__dirname, '..', ...directories, name);
};

export default getParsedFileContent;
export { getPath };
