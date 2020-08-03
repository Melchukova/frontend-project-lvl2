import readFile from './src/file-reader.js';
import compareObjects from './src/compare-objects.js';
import getFormatter from './src/formatters/index.js';

const findDifference = (pathFile1, pathFile2, format = 'stylish') => {
  const obj1 = readFile(pathFile1);
  const obj2 = readFile(pathFile2);

  const difference = compareObjects(obj1, obj2);
  const formatObj = getFormatter(format);
  const differenceStr = formatObj(difference);

  return differenceStr;
};

export default findDifference;
