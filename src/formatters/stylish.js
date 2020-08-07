import _ from 'lodash';

const generateDifStringsForBranch = (indentsAmount, key, value, typeSign) => {
  const indent = ('  ').repeat(indentsAmount);
  if (!_.isObject(value)) return `${indent}${typeSign} ${key}: ${value}`;

  const stringsForValue = Object.entries(value).map(([objKey, objValue]) => (
    generateDifStringsForBranch(indentsAmount + 2, objKey, objValue, ' ')
  ));
  return [
    `${indent}${typeSign} ${key}: {`,
    stringsForValue,
    `${indent}  }`,
  ];
};

const generateDifStrings = (indentsAmount, tree) => (
  tree.map((node) => {
    switch (node.type) {
      case 'unchanged':
        return generateDifStringsForBranch(indentsAmount, node.key, node.value1, ' ');
      case 'added':
        return generateDifStringsForBranch(indentsAmount, node.key, node.value2, '+');
      case 'removed':
        return generateDifStringsForBranch(indentsAmount, node.key, node.value1, '-');
      case 'changed':
        return [
          generateDifStringsForBranch(indentsAmount, node.key, node.value1, '-'),
          generateDifStringsForBranch(indentsAmount, node.key, node.value2, '+'),
        ];
      case 'nested': {
        const indent = ('  ').repeat(indentsAmount);
        return [
          `${indent}  ${node.key}: {`,
          generateDifStrings(indentsAmount + 2, node.child),
          `${indent}  }`,
        ];
      }
      default:
        return new Error(`Wrong node type: '${node.type}'`);
    }
  })
);

const generatePrintString = (tree) => {
  const arrayOfStrings = generateDifStrings(1, tree);
  const arrayOfStringsWithBrackets = [
    '{',
    ...arrayOfStrings,
    '}',
  ];

  const printString = _.flattenDeep(arrayOfStringsWithBrackets).join('\n');

  return printString;
};

export default generatePrintString;
