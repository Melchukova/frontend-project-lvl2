import readFile from './file-reader.js';
import compareObjects from './compare-objects.js';

const findDifference = (pathFile1, pathFile2, format) => {
  const obj1 = readFile(pathFile1);
  const obj2 = readFile(pathFile2);

  const difference = compareObjects(obj1, obj2, format);
  return difference;
};

export default findDifference;
