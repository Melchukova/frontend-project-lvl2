import _ from 'lodash';
import getFormatter from './formatters/index.js';

const makeNumberFromStr = (value) => {
  const num = Number(value);
  const isNum = !Number.isNaN(num) && typeof value === 'string';
  return isNum ? num : value;
};

const generateRec = (key, value, action) => ({ key, value, action });

const generateRecForVal = (key, value, action) => {
  if (!_.isObject(value)) {
    return generateRec(key, makeNumberFromStr(value), action);
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

const sortRecs = ((a, b) => {
  if (a.key > b.key) return 1;
  if (a.key < b.key) return -1;
  if (a.action === 'added' || a.action === 'updated to') return 1;
  return -1;
});

const compareObjects = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  const removedKeys = _.difference(keys1, keys2);
  const addedKeys = _.difference(keys2, keys1);
  const intersectionKeys = _.intersection(keys2, keys1);

  const keysWithNotUpdatedVal = intersectionKeys.filter((key) => {
    const val1 = obj1[key];
    const val2 = obj2[key];

    return val1 === val2;
  });

  const keysWithBothValIsObj = intersectionKeys.filter((key) => {
    const val1 = obj1[key];
    const val2 = obj2[key];

    return _.isObject(val1) && _.isObject(val2);
  });

  const keysWithUpdatedVal = _.difference(
    intersectionKeys,
    keysWithNotUpdatedVal,
    keysWithBothValIsObj,
  );

  const comparedObjWithValObjects = keysWithBothValIsObj.reduce((arr, key) => {
    const val1 = obj1[key];
    const val2 = obj2[key];
    const comparedVal = compareObjects(val1, val2);
    return [...arr, generateRec(key, comparedVal, 'not changed')];
  }, []);

  const recsOfCompared = [
    ...generateActionsRecs(obj1, removedKeys, 'removed'),
    ...generateActionsRecs(obj2, addedKeys, 'added'),
    ...generateActionsRecs(obj1, keysWithNotUpdatedVal, 'not changed'),
    ...generateActionsRecs(obj1, keysWithUpdatedVal, 'updated from'),
    ...generateActionsRecs(obj2, keysWithUpdatedVal, 'updated to'),
    ...comparedObjWithValObjects,
  ];

  const recsOfComparedSorted = recsOfCompared.sort(sortRecs);

  return recsOfComparedSorted;
};

const findDifference = (obj1, obj2, format) => {
  const differenceArr = compareObjects(obj1, obj2);
  const formatObj = getFormatter(format);
  const differenceStr = formatObj(differenceArr);

  return differenceStr;
};

export default findDifference;
