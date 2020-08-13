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
const space = 4;
const gap = ' ';

const getIndents = (level) => gap.repeat(level * space);

const keyStringify = (key, sign, level) => `${sign.padStart(space * level, gap)}${key}`;

const valueStringify = (value, level = 1) => {
  if (!_.isObject(value)) {
    return value;
  }

  const diffString = Object.entries(value).map(([objectKey, objectValue]) => (
    // eslint-disable-next-line no-use-before-define
    branchStringify(objectKey, objectValue, signs.empty, level)
  )).join('\n');

  return `${bracket.open}\n${diffString}\n${getIndents(level - 1)}${bracket.close}`;
};

const branchStringify = (key, value, sign, level) => (
  `${keyStringify(key, sign, level)}: ${valueStringify(value, level + 1)}`
);

const formatTree = (tree, level) => {
  const diffString = tree.flatMap((node) => {
    switch (node.type) {
      case 'unchanged':
        return branchStringify(node.key, node.value1, signs.unchanged, level);
      case 'added':
        return branchStringify(node.key, node.value2, signs.added, level);
      case 'removed':
        return branchStringify(node.key, node.value1, signs.removed, level);
      case 'changed':
        return [
          branchStringify(node.key, node.value1, signs.removed, level),
          branchStringify(node.key, node.value2, signs.added, level),
        ];
      case 'nested': {
        const key = keyStringify(node.key, signs.unchanged, level);
        const value = formatTree(node.child, level + 1);
        return `${key}: ${value}`;
      }
      default:
        return new Error(`Wrong node type: '${node.type}'`);
    }
  }).join('\n');

  return `${bracket.open}\n${diffString}\n${getIndents(level - 1)}${bracket.close}`;
};

const generateString = (tree) => formatTree(tree, 1);

export { generateString, valueStringify };
