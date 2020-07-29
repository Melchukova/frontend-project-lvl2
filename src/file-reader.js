import fs from 'fs';
import { extname } from 'path';
import getParser from './parsers.js';

const readFile = (path) => fs.readFileSync(path, 'utf-8');

const getParsedFileContent = (path) => {
  const content = readFile(path);

  const ext = extname(path);
  const format = ext.substr(1);

  const parse = getParser(format);

  return parse(content);
};

export default getParsedFileContent;
