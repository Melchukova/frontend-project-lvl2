import readFile from './file-reader.js';
import compareObjects from './compare-objects.js';

const findDifference = (pathBeforeFile, pathAfterFile, format) => {
  const beforeObj = readFile(pathBeforeFile);
  const afterObj = readFile(pathAfterFile);

  const difference = compareObjects(beforeObj, afterObj, format);
  return difference;
};

export default findDifference;
