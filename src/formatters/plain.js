import _ from 'lodash';

const generateValStr = (val) => {
  if (_.isArray(val)) return '[complex value]';
  if (typeof val === 'string') return `'${val}'`;
  return val;
};

const generateDetailStr = (key, value, action, afterValue) => {
  switch (action) {
    case 'removed':
      return 'removed';
    case 'added':
      return `added with value: ${value}`;
    case 'updated from':
      return `updated. From ${value} to ${afterValue}`;
    default:
      throw new Error(`Wrong object action for print: '${action}' - for key '${key}'`);
  }
};

const generateDifStr = (path, key, value, action, afterValue = '') => {
  const valueStr = generateValStr(value);
  const afterValueStr = generateValStr(afterValue);

  const property = `Property '${path}${key}' was `;
  const details = generateDetailStr(key, valueStr, action, afterValueStr);

  return `${property}${details}`;
};

const getAfterValueByKey = (arr, key) => {
  const afterObj = arr.find((obj) => (
    obj.key === key && obj.action === 'updated to'
  ));
  return afterObj.value;
};

const generateDifStringsForObj = (path, obj, arr) => {
  if (obj.action === 'removed' || obj.action === 'added') {
    return generateDifStr(path, obj.key, obj.value, obj.action);
  }

  if (obj.action === 'updated from') {
    const afterValue = getAfterValueByKey(arr, obj.key);
    return generateDifStr(path, obj.key, obj.value, obj.action, afterValue);
  }

  if (_.isArray(obj.value) && obj.action === 'not changed') {
    const newPath = `${path}${obj.key}.`;
    // eslint-disable-next-line no-use-before-define
    return generateDifStringsForArr(newPath, obj.value);
  }
  return [];
};

const generateDifStringsForArr = (path, arr) => {
  const complexArr = arr.reduce((newArr, obj) => {
    const arrOfStrForObj = generateDifStringsForObj(path, obj, arr);
    return [newArr, arrOfStrForObj];
  }, []);

  const resultArr = _.flattenDeep(complexArr);
  return resultArr;
};

const generatePrintStr = (arr) => {
  const arrOfStr = generateDifStringsForArr('', arr);

  const printString = arrOfStr.join('\n');

  return printString;
};

export default generatePrintStr;
