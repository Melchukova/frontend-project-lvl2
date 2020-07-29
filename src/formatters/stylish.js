import _ from 'lodash';

const getActionSign = (action, key) => {
  switch (action) {
    case 'removed':
    case 'updated from':
      return '-';
    case 'added':
    case 'updated to':
      return '+';
    case 'not changed':
      return ' ';
    default:
      throw new Error(`Wrong object action: '${action}' - for key '${key}'`);
  }
};

const generateDifStringsForObj = (indentsAmount, obj) => {
  const indent = ('  ').repeat(indentsAmount);
  const actionSign = getActionSign(obj.action, obj.key);
  if (!_.isArray(obj.value)) return `${indent}${actionSign} ${obj.key}: ${obj.value}`;

  // eslint-disable-next-line no-use-before-define
  const stringsForValue = generateDifStringsForArr(indentsAmount + 2, obj.value);
  return [
    `${indent}${actionSign} ${obj.key}: {`,
    stringsForValue,
    `${indent}  }`,
  ];
};

const generateDifStringsForArr = (indentsAmount, arr) => {
  const compexArr = arr.reduce((newArr, obj) => {
    const arrOfStrForObj = generateDifStringsForObj(indentsAmount, obj);
    return [newArr, arrOfStrForObj];
  }, []);

  const resultArr = _.flattenDeep(compexArr);
  return resultArr;
};

const generatePrintString = (arr) => {
  const arrOfStr = generateDifStringsForArr(1, arr);
  const arrOfStrWithBrackets = [
    '{',
    ...arrOfStr,
    '}',
  ];

  const printString = arrOfStrWithBrackets.join('\n');

  return printString;
};

export default generatePrintString;
