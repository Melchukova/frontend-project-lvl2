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

const formatStylish = (tree) => {
  const iter = (branch, gap) => (
    branch.flatMap((node) => {
      switch (node.type) {
        case 'unchanged':
          return `${addPrefix(node.key, gap, signs.unchanged)}: ${stringify(node.value1, gap)}`;
        case 'added':
          return `${addPrefix(node.key, gap, signs.added)}: ${stringify(node.value2, gap)}`;
        case 'removed':
          return `${addPrefix(node.key, gap, signs.removed)}: ${stringify(node.value1, gap)}`;
        case 'changed':
          return [
            `${addPrefix(node.key, gap, signs.removed)}: ${stringify(node.value1, gap)}`,
            `${addPrefix(node.key, gap, signs.added)}: ${stringify(node.value2, gap)}`,
          ];
        case 'nested':
          return [
            `${addPrefix(node.key, gap, signs.unchanged)}: ${openSymbol}`,
            ...iter(node.child, addPrefix(gapSymbol, gap)),
            addPrefix(closeSymbol, gap),
          ];
        default:
          return new Error(`Wrong node type: '${node.type}'`);
      }
    })
  );

  const lines = iter(tree, '  ');
  return [openSymbol, ...lines, closeSymbol];
};

export default (tree) => formatStylish(tree).join('\n');
