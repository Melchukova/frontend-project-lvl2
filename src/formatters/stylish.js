import _ from 'lodash';

const generateDifStringsForObj = (indentsAmount, key, value, typeSign) => {
  const indent = ('  ').repeat(indentsAmount);
  if (!_.isObject(value)) return `${indent}${typeSign} ${key}: ${value}`;

  const stringsForValue = Object.entries(value).map(([objKey, objValue]) => (
    generateDifStringsForObj(indentsAmount + 2, objKey, objValue, ' ')
  ));
  return [
    `${indent}${typeSign} ${key}: {`,
    stringsForValue,
    `${indent}  }`,
  ];
};

const generateDifStringsForArr = (indentsAmount, arr) => (
  arr.map((obj) => {
    if (obj.type === 'added') {
      return generateDifStringsForObj(indentsAmount, obj.key, obj.value2, '+');
    }

    if (obj.type === 'removed') {
      return generateDifStringsForObj(indentsAmount, obj.key, obj.value1, '-');
    }

    if (obj.type === 'changed') {
      return [
        generateDifStringsForObj(indentsAmount, obj.key, obj.value1, '-'),
        generateDifStringsForObj(indentsAmount, obj.key, obj.value2, '+'),
      ];
    }

    if (obj.type === 'nested') {
      const indent = ('  ').repeat(indentsAmount);
      return [`${indent}  ${obj.key}: {`,
        generateDifStringsForArr(indentsAmount + 2, obj.child),
        `${indent}  }`,
      ];
    }

    return generateDifStringsForObj(indentsAmount, obj.key, obj.value1, ' ');
  })
);

const generatePrintString = (tree) => {
  const arrOfStr = generateDifStringsForArr(1, tree);
  const arrOfStrWithBrackets = [
    '{',
    ...arrOfStr,
    '}',
  ];

  const printString = _.flattenDeep(arrOfStrWithBrackets).join('\n');

  return printString;
};

export default generatePrintString;
