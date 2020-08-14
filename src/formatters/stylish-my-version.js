import _ from 'lodash';

const signs = {
  unchanged: ' ',
  added: '+',
  removed: '-',
};
const openSymbol = '{';
const closeSymbol = '}';
const keyOffset = 4;
const gapSymbol = ' ';

const addIndent = (key, level, sign = '') => `${sign.padStart(keyOffset * level - 1, gapSymbol)} ${key}`;

const stringify = (value, level) => {
  if (!_.isObject(value)) {
    return value;
  }

  const lines = [
    openSymbol,
    ...Object.entries(value).map(([objectKey, objectValue]) => (
      // eslint-disable-next-line no-use-before-define
      branchStringify(objectKey, objectValue, level)
    )),
    addIndent(closeSymbol, level - 1),
  ];

  return lines.join('\n');
};

const branchStringify = (key, value, level, sign) => (
  `${addIndent(key, level, sign)}: ${stringify(value, level + 1)}`
);

const iter = (tree, level) => {
  const lines = [
    openSymbol,
    ...tree.flatMap((node) => {
      switch (node.type) {
        case 'unchanged':
          return branchStringify(node.key, node.value1, level, signs.unchanged);
        case 'added':
          return branchStringify(node.key, node.value2, level, signs.added);
        case 'removed':
          return branchStringify(node.key, node.value1, level, signs.removed);
        case 'changed':
          return [
            branchStringify(node.key, node.value1, level, signs.removed),
            branchStringify(node.key, node.value2, level, signs.added),
          ];
        case 'nested': {
          return `${addIndent(node.key, level)}: ${iter(node.child, level + 1)}`;
        }
        default:
          return new Error(`Wrong node type: '${node.type}'`);
      }
    }),
    level === 1 ? closeSymbol : addIndent(closeSymbol, level - 1),
  ];

  return lines.join('\n');
};

const formatStylish = (tree) => iter(tree, 1);

export default formatStylish;
