import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import getParser from './parsers.js';
import getPrintStr from './stylish.js';

const getObjectFromPath = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const format = path.extname(filePath);
  const parse = getParser(format);
  return parse(content);
};

const genValue = (value) => {
  if (!_.isObject(value)) return value;

  const entries = Object.entries(value);
  const updObj = entries.reduce((newObj, [key, val]) => ({ ...newObj, [`  ${key}`]: val }), {});

  return updObj;
};

const compareElements = (key, val1, val2) => {
  if (!_.isUndefined(val1) && _.isUndefined(val2)) {
    return { [`- ${key}`]: genValue(val1) };
  }

  if (_.isUndefined(val1) && !_.isUndefined(val2)) {
    return { [`+ ${key}`]: genValue(val2) };
  }

  if (!_.isObject(val1)) {
    if (val1 === val2) {
      return { [`  ${key}`]: val1 };
    }

    return {
      [`- ${key}`]: val1,
      [`+ ${key}`]: genValue(val2),
    };
  }

  if (!_.isObject(val2)) {
    return {
      [`- ${key}`]: genValue(val1),
      [`+ ${key}`]: val2,
    };
  }

  // eslint-disable-next-line no-use-before-define
  const comparedObjects = compareObjects(val1, val2);
  return {
    [`  ${key}`]: comparedObjects,
  };
};

const compareObjects = (obj1, obj2) => {
  const allKeys = [...Object.keys(obj1), ...Object.keys(obj2)];
  const keys = _.uniq(allKeys).sort();

  const diffObj = keys.reduce((acc, key) => {
    const valBefore = obj1[key];
    const valAfter = obj2[key];

    return { ...acc, ...compareElements(key, valBefore, valAfter) };
  }, []);

  return diffObj;
};

const findDifference = (filepath1, filepath2) => {
  const obj1 = getObjectFromPath(filepath1);
  const obj2 = getObjectFromPath(filepath2);

  const differenceObj = compareObjects(obj1, obj2);
  const differenceStr = getPrintStr(differenceObj);

  return differenceStr;
};

export default findDifference;
