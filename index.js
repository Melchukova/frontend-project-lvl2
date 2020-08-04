import readFile from './src/fileReader.js';
import buildDifferenceTree from './src/diffTreeBuilder.js';
import getFormatter from './src/formatters/index.js';

const findDifference = (pathFile1, pathFile2, format = 'stylish') => {
  const obj1 = readFile(pathFile1);
  const obj2 = readFile(pathFile2);

  const tree = buildDifferenceTree(obj1, obj2);
  const formatObj = getFormatter(format);
  const differenceStr = formatObj(tree);

  return differenceStr;
};

export default findDifference;
