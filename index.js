import { readFile, getFormat } from './src/fileReader.js';
import parse from './src/parsers.js';
import buildDifferenceTree from './src/diffTreeBuilder.js';
import format from './src/formatters/index.js';

const genDiff = (pathFile1, pathFile2, outputFormat = 'stylish') => {
  const content1 = readFile(pathFile1);
  const content2 = readFile(pathFile2);
  const format1 = getFormat(pathFile1);
  const format2 = getFormat(pathFile2);
  const obj1 = parse(content1, format1);
  const obj2 = parse(content2, format2);
  const tree = buildDifferenceTree(obj1, obj2);
  return format(tree, outputFormat);
};

export default genDiff;
