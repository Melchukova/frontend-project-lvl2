import _ from 'lodash';

const signs = {
  unchanged: '  ',
  added: '+ ',
  removed: '- ',
  empty: '',
};
const bracket = {
  open: '{',
  close: '}',
};
const space = 2;
const defaultGap = '  ';

const getIndents = (gap, spaces) => gap.repeat(spaces);

const keyStringify = (key, sign, gap, spaces) => `${sign.padStart(spaces * gap.length, ' ')}${key}`;

const valueStringify = (value, gap, spaces) => {
  if (!_.isObject(value)) {
    return value;
  }

  const diffString = Object.entries(value).map(([objectKey, objectValue]) => (
    // eslint-disable-next-line no-use-before-define
    branchStringify(objectKey, objectValue, signs.empty, gap, spaces)
  )).join('\n');

  return `${bracket.open}\n${diffString}\n${getIndents(gap, spaces - space)}${bracket.close}`;
};

const branchStringify = (key, value, sign, gap, spaces) => (
  `${keyStringify(key, sign, gap, spaces)}: ${valueStringify(value, gap, spaces + space)}`
);

const formatTree = (tree, gap, spaces) => {
  const diffString = tree.flatMap((node) => {
    switch (node.type) {
      case 'unchanged':
        return branchStringify(node.key, node.value1, signs.unchanged, gap, spaces);
      case 'added':
        return branchStringify(node.key, node.value2, signs.added, gap, spaces);
      case 'removed':
        return branchStringify(node.key, node.value1, signs.removed, gap, spaces);
      case 'changed':
        return [
          branchStringify(node.key, node.value1, signs.removed, gap, spaces),
          branchStringify(node.key, node.value2, signs.added, gap, spaces),
        ];
      case 'nested': {
        const key = keyStringify(node.key, signs.unchanged, gap, spaces);
        const value = formatTree(node.child, gap, spaces + space);
        return `${key}: ${value}`;
      }
      default:
        return new Error(`Wrong node type: '${node.type}'`);
    }
  }).join('\n');

  return `${bracket.open}\n${diffString}\n${getIndents(gap, spaces - space)}${bracket.close}`;
};

const generateString = (tree) => formatTree(tree, defaultGap, space);

export { generateString, valueStringify };
