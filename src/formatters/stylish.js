import _ from 'lodash';

const signs = {
  unchanged: ' ',
  added: '+',
  removed: '-',
};

const openSymbol = '{';
const closeSymbol = '}';
const gapSymbol = '  ';

const addPrefix = (key, indent, prefix = ' ') => `${indent}${prefix} ${key}`;

const stringify = (obj, gap) => {
  if (!_.isObject(obj)) {
    return obj;
  }

  const deepGap = addPrefix(gapSymbol, gap);
  const lines = [
    openSymbol,
    ...Object.entries(obj).flatMap(([key, value]) => (
      `${addPrefix(key, deepGap)}: ${stringify(value, deepGap)}`
    )),
    addPrefix(closeSymbol, gap),
  ];

  return lines.join('\n');
};

const iter = (subTree, gap) => {
  const currentGap = gap === '' ? gapSymbol : addPrefix(gapSymbol, gap);
  const lines = [
    openSymbol,
    ...subTree.flatMap((node) => {
      switch (node.type) {
        case 'unchanged':
          return `${addPrefix(node.key, currentGap, signs.unchanged)}: ${stringify(node.value1, currentGap)}`;
        case 'added':
          return `${addPrefix(node.key, currentGap, signs.added)}: ${stringify(node.value2, currentGap)}`;
        case 'removed':
          return `${addPrefix(node.key, currentGap, signs.removed)}: ${stringify(node.value1, currentGap)}`;
        case 'changed':
          return [
            `${addPrefix(node.key, currentGap, signs.removed)}: ${stringify(node.value1, currentGap)}`,
            `${addPrefix(node.key, currentGap, signs.added)}: ${stringify(node.value2, currentGap)}`,
          ];
        case 'nested':
          return `${addPrefix(node.key, currentGap, signs.unchanged)}: ${iter(node.child, currentGap)}`;
        default:
          return new Error(`Wrong node type: '${node.type}'`);
      }
    }),
    gap === '' ? closeSymbol : addPrefix(closeSymbol, gap),
  ];

  return lines.join('\n');
};

const formatStylish = (tree) => iter(tree, '');

export default formatStylish;
