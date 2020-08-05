import getParsedFileContent from './src/fileReader.js';
import buildDifferenceTree from './src/diffTreeBuilder.js';
import getFormatter from './src/formatters/index.js';

const genDiff = (pathFile1, pathFile2, format = 'stylish') => {
  const obj1 = getParsedFileContent(pathFile1);
  const obj2 = getParsedFileContent(pathFile2);

  const tree = buildDifferenceTree(obj1, obj2);
  const differenceStr = getFormatter(format)(tree);

  return differenceStr;
};

export default genDiff;
