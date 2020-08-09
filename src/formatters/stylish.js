import _ from 'lodash';

const indent = (size) => ('  ').repeat(size);

const formatKey = (key, typeSign, indentsSize) => `${indent(indentsSize)}${typeSign} ${key}`;

const formatValue = (indentsSize, value) => {
  if (_.isArray(value)) {
    return `[${value.join(', ')}]`;
  }

  if (!_.isObject(value)) {
    return value;
  }

  const stringsForValue = Object.entries(value).map(([objectKey, objectValue]) => (
    // eslint-disable-next-line no-use-before-define
    formatBranch(indentsSize + 2, objectKey, objectValue)
  ));

  return `{\n${stringsForValue.join('\n')}\n${indent(indentsSize + 1)}}`;
};

const formatBranch = (indentsSize, key, value, typeSign = ' ') => (
  `${formatKey(key, typeSign, indentsSize)}: ${formatValue(indentsSize, value)}`
);

const formatTree = (indentsSize, tree) => {
  const arr = tree.flatMap((node) => {
    switch (node.type) {
      case 'unchanged':
        return formatBranch(indentsSize, node.key, node.value1, ' ');
      case 'added':
        return formatBranch(indentsSize, node.key, node.value2, '+');
      case 'removed':
        return formatBranch(indentsSize, node.key, node.value1, '-');
      case 'changed':
        return [
          formatBranch(indentsSize, node.key, node.value1, '-'),
          formatBranch(indentsSize, node.key, node.value2, '+'),
        ];
      case 'nested':
        return `${formatKey(node.key, ' ', indentsSize)}: ${formatTree(indentsSize + 2, node.child)}`;
      default:
        return new Error(`Wrong node type: '${node.type}'`);
    }
  });

  return `{\n${arr.join('\n')}\n${indent(indentsSize - 1)}}`;
};

const generateString = (tree) => formatTree(1, tree);

export default generateString;
