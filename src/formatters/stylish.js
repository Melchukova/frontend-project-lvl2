import _ from 'lodash';

const getIndent = (size) => ('  ').repeat(size);

const formatKey = (key, typeSign, indentsSize) => `${getIndent(indentsSize)}${typeSign} ${key}`;

const formatValue = (value, gap, indentsSize) => {
  if (!_.isObject(value)) {
    return value;
  }

  const diffString = Object.entries(value).map(([objectKey, objectValue]) => (
    // eslint-disable-next-line no-use-before-define
    formatBranch(indentsSize + 2, objectKey, objectValue, gap)
  )).join('\n');

  return `{\n${diffString}\n${getIndent(indentsSize + 1)}}`;
};

const formatBranch = (indentsSize, key, value, typeSign) => (
  `${formatKey(key, typeSign, indentsSize)}: ${formatValue(value, ' ', indentsSize)}`
);

const formatTree = (indentsSize, tree) => {
  const diffString = tree.flatMap((node) => {
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
  }).join('\n');

  return `{\n${diffString}\n${getIndent(indentsSize - 1)}}`;
};

const generateString = (tree) => formatTree(1, tree);

export default generateString;
