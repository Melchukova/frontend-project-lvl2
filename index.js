import { readFile, getFormat } from './src/fileReader.js';
import parce from './src/parsers.js';
import buildDifferenceTree from './src/diffTreeBuilder.js';
import format from './src/formatters/index.js';

const genDiff = (pathFile1, pathFile2, outputFormat = 'stylish') => {
  const content1 = readFile(pathFile1);
  const content2 = readFile(pathFile2);
  const format1 = getFormat(pathFile1);
  const format2 = getFormat(pathFile2);
  const obj1 = parce(format1)(content1);
  const obj2 = parce(format2)(content2);
  const tree = buildDifferenceTree(obj1, obj2);
  return format(tree, outputFormat);
};

export default genDiff;
