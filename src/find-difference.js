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

const generateRec = (key, value, action) => ({ key, value, action });

const generateRecForVal = (key, value, action) => {
  if (!_.isObject(value)) {
    return generateRec(key, value, action);
  }

  // eslint-disable-next-line no-use-before-define
  const newVal = generateActionsRecs(value, Object.keys(value), 'not changed');
  return generateRec(key, newVal, action);
};

const generateActionsRecs = (obj, keys, action) => {
  const recs = keys.reduce((arr, key) => (
    [...arr, generateRecForVal(key, obj[key], action)]
  ), []);

  return recs;
};

const compareObjects = (beforeObj, afterObj) => {
  const beforeKeys = Object.keys(beforeObj);
  const afterKeys = Object.keys(afterObj);

  const removedKeys = _.difference(beforeKeys, afterKeys);
  const addedKeys = _.difference(afterKeys, beforeKeys);
  const intersectionKeys = _.intersection(afterKeys, beforeKeys);

  const keysWithNotUpdatedVal = intersectionKeys.filter((key) => {
    const beforeVal = beforeObj[key];
    const afterVal = afterObj[key];

    return beforeVal === afterVal;
  });

  const keysWithBothValIsObj = intersectionKeys.filter((key) => {
    const beforeVal = beforeObj[key];
    const afterVal = afterObj[key];

    return _.isObject(beforeVal) && _.isObject(afterVal);
  });

  const keysWithUpdatedVal = _.difference(
    intersectionKeys,
    keysWithNotUpdatedVal,
    keysWithBothValIsObj,
  );

  const comparedObjWithValObjects = keysWithBothValIsObj.reduce((arr, key) => {
    const beforeVal = beforeObj[key];
    const afterVal = afterObj[key];
    const comparedVal = compareObjects(beforeVal, afterVal);
    return [...arr, generateRec(key, comparedVal, 'not changed')];
  }, []);

  const recsOfCompared = [
    ...generateActionsRecs(beforeObj, removedKeys, 'removed'),
    ...generateActionsRecs(afterObj, addedKeys, 'added'),
    ...generateActionsRecs(beforeObj, keysWithNotUpdatedVal, 'not changed'),
    ...generateActionsRecs(beforeObj, keysWithUpdatedVal, 'updated from'),
    ...generateActionsRecs(afterObj, keysWithUpdatedVal, 'updated to'),
    ...comparedObjWithValObjects,
  ];

  const recsOfComparedSorted = recsOfCompared.sort((a, b) => {
    if (a.key > b.key) return 1;
    if (a.key < b.key) return -1;
    if (a.action === 'added' || a.action === 'updated to') return 1;
    return -1;
  });

  return recsOfComparedSorted;
};

const findDifference = (pathBeforeFile, pathAfterFile, format) => {
  const beforeObj = getObjectFromPath(pathBeforeFile);
  const afterObj = getObjectFromPath(pathAfterFile);

  const differenceArr = compareObjects(beforeObj, afterObj);
  const formatObj = getFormatter(format);
  const differenceStr = formatObj(differenceArr);

  return differenceStr;
};

export default findDifference;
