import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import getParser from './parsers.js';
import getFormatter from './formatters/index.js';

const getObjectFromPath = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const format = path.extname(filePath);
  const parse = getParser(format);
  return parse(content);
};

const genDiffObj = (key, value, action) => {
  if (!_.isObject(value)) return { key, value, action };

  // const entries = Object.entries(value);
  // const objValue = entries.reduce((arr, [objKey, objVal]) => ([...arr, genDiffObj(objKey, objVal, '')]), []);
  // return { key, value: objValue, action };
};

const compareValues = (key, valBefore, valAfter) => {
  if (!_.isUndefined(valBefore) && _.isUndefined(valAfter)) {
    return genDiffObj(key, valBefore, '-');
  }

  if (_.isUndefined(val1) && !_.isUndefined(valAfter)) {
    return genDiffObj(key, valAfter, '+');
  }

  if (!_.isObject(val1)) {
    if (val1 === val2) {
      return [genDiffObj(key, val1, '')];
    }

    return [
      genDiffObj(key, val1, 'remove'),
      genDiffObj(key, val2, 'add'),
    ];
  }

  if (!_.isObject(val2)) {
    return [
      genDiffObj(key, val1, 'remove'),
      genDiffObj(key, val2, 'add'),
    ];
  }

  // eslint-disable-next-line no-use-before-define
  const comparedObjects = compareObjects(val1, val2);
  return [genDiffObj(key, comparedObjects, '')];
};

const compareObjects = (beforeObj, afterObj) => {
  const allKeys = [...Object.keys(beforeObj), ...Object.keys(afterObj)];
  const keys = _.uniq(allKeys).sort();

  const diffObj = keys.reduce((acc, key) => {
    const beforeVal = beforeObj[key];
    const afterVal = afterObj[key];

    return [...acc, ...compareValues(key, beforeVal, afterVal)];
  }, []);

  return diffObj;
};

const findDifference = (pathBeforeFile, pathAfterFile, format) => {
  const beforeObj = getObjectFromPath(pathBeforeFile);
  const afterObj = getObjectFromPath(pathAfterFile);

  const differenceArr = compareObjects(beforeObj, afterObj);
  console.log('differenceArr', differenceArr);
  const formatObj = getFormatter(format);
  const differenceStr = formatObj(differenceArr);

  return differenceStr;
};

export default findDifference;
