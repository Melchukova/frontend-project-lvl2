import _ from 'lodash';

const signs = {
  unchanged: ' ',
  added: '+',
  removed: '-',
};
const bracket = {
  open: '{',
  close: '}',
};
const space = 2;
const indent = '  ';
const getIndents = (spaces) => indent.repeat(spaces);

const keyStringify = (key, sign, indents) => `${indents}${indent}${sign} ${key}`;

const valueStringify = (value, sign, spaces) => {
  if (!_.isObject(value)) {
    return value;
  }

  const diffString = Object.entries(value).map(([objectKey, objectValue]) => (
    // eslint-disable-next-line no-use-before-define
    branchStringify(objectKey, objectValue, sign, spaces + space)
  )).join('\n');

  return `${bracket.open}\n${diffString}\n${getIndents(spaces + space)}${bracket.close}`;
};

const branchStringify = (key, value, sign, spaces) => (
  `${keyStringify(key, sign, getIndents(spaces))}: ${valueStringify(value, signs.unchanged, spaces)}`
);

const formatTree = (tree, spaces) => {
  const indents = getIndents(spaces);
  const diffString = tree.flatMap((node) => {
    switch (node.type) {
      case 'unchanged':
        return branchStringify(node.key, node.value1, signs.unchanged, spaces);
      case 'added':
        return branchStringify(node.key, node.value2, signs.added, spaces);
      case 'removed':
        return branchStringify(node.key, node.value1, signs.removed, spaces);
      case 'changed':
        return [
          branchStringify(node.key, node.value1, signs.removed, spaces),
          branchStringify(node.key, node.value2, signs.added, spaces),
        ];
      case 'nested':
        return `${keyStringify(node.key, ' ', indents)}: ${formatTree(node.child, spaces + space)}`;
      default:
        return new Error(`Wrong node type: '${node.type}'`);
    }
  }).join('\n');

  return `${bracket.open}\n${diffString}\n${indents}${bracket.close}`;
};

const generateString = (tree) => formatTree(tree, 0);

export default generateString;
