import readFile from './src/file-reader.js';
import compareObjects from './src/compare-objects.js';

const findDifference = (pathFile1, pathFile2, format = 'stylish') => {
  const obj1 = readFile(pathFile1);
  const obj2 = readFile(pathFile2);

  const difference = compareObjects(obj1, obj2, format);
  return difference;
};

export default findDifference;
