import _ from 'lodash';

const formatBranch = (indentsAmount, key, value, typeSign) => {
  const indent = ('  ').repeat(indentsAmount);
  if (!_.isObject(value)) return `${indent}${typeSign} ${key}: ${value}`;

  const stringsForValue = Object.entries(value).map(([objKey, objValue]) => (
    formatBranch(indentsAmount + 2, objKey, objValue, ' ')
  ));
  return [
    `${indent}${typeSign} ${key}: {`,
    stringsForValue,
    `${indent}  }`,
  ];
};

const formatTree = (indentsAmount, tree) => (
  tree.map((node) => {
    switch (node.type) {
      case 'unchanged':
        return formatBranch(indentsAmount, node.key, node.value1, ' ');
      case 'added':
        return formatBranch(indentsAmount, node.key, node.value2, '+');
      case 'removed':
        return formatBranch(indentsAmount, node.key, node.value1, '-');
      case 'changed':
        return [
          formatBranch(indentsAmount, node.key, node.value1, '-'),
          formatBranch(indentsAmount, node.key, node.value2, '+'),
        ];
      case 'nested': {
        const indent = ('  ').repeat(indentsAmount);
        return [
          `${indent}  ${node.key}: {`,
          formatTree(indentsAmount + 2, node.child),
          `${indent}  }`,
        ];
      }
      default:
        return new Error(`Wrong node type: '${node.type}'`);
    }
  })
);

const generateString = (tree) => {
  const arrayOfStrings = formatTree(1, tree);
  const arrayOfStringsWithBrackets = [
    '{',
    ...arrayOfStrings,
    '}',
  ];

  const printString = _.flattenDeep(arrayOfStringsWithBrackets).join('\n');

  return printString;
};

export default generateString;
