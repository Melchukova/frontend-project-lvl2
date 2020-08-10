import _ from 'lodash';

const getIndent = (size) => ('  ').repeat(size);

const keyStringify = (key, typeSign, indentsSize) => `${getIndent(indentsSize)}${typeSign} ${key}`;

const valueStringify = (value, gap, indentsSize) => {
  if (!_.isObject(value)) {
    return value;
  }

  const diffString = Object.entries(value).map(([objectKey, objectValue]) => (
    // eslint-disable-next-line no-use-before-define
    branchStringify(indentsSize + 2, objectKey, objectValue, gap)
  )).join('\n');

  return `{\n${diffString}\n${getIndent(indentsSize + 1)}}`;
};

const branchStringify = (indentsSize, key, value, typeSign) => (
  `${keyStringify(key, typeSign, indentsSize)}: ${valueStringify(value, ' ', indentsSize)}`
);

const formatTree = (indentsSize, tree) => {
  const diffString = tree.flatMap((node) => {
    switch (node.type) {
      case 'unchanged':
        return branchStringify(indentsSize, node.key, node.value1, ' ');
      case 'added':
        return branchStringify(indentsSize, node.key, node.value2, '+');
      case 'removed':
        return branchStringify(indentsSize, node.key, node.value1, '-');
      case 'changed':
        return [
          branchStringify(indentsSize, node.key, node.value1, '-'),
          branchStringify(indentsSize, node.key, node.value2, '+'),
        ];
      case 'nested':
        return `${keyStringify(node.key, ' ', indentsSize)}: ${formatTree(indentsSize + 2, node.child)}`;
      default:
        return new Error(`Wrong node type: '${node.type}'`);
    }
  }).join('\n');

  return `{\n${diffString}\n${getIndent(indentsSize - 1)}}`;
};

const generateString = (tree) => formatTree(1, tree);

export default generateString;
