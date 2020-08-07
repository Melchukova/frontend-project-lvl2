import _ from 'lodash';

const stringify = (value) => {
  if (_.isObject(value)) return '[complex value]';
  if (_.isString(value)) return `'${value}'`;
  return value;
};

const generateDifStrings = (path, tree) => (
  tree.map((node) => {
    switch (node.type) {
      case 'unchanged':
        return [];
      case 'added':
        return `Property '${path}${node.key}' was added with value: ${stringify(node.value2)}`;
      case 'removed':
        return `Property '${path}${node.key}' was removed`;
      case 'changed':
        return `Property '${path}${node.key}' was updated. From ${stringify(node.value1)} to ${stringify(node.value2)}`;
      case 'nested':
        return generateDifStrings(`${path}${node.key}.`, node.child);
      default:
        return new Error(`Wrong node type: '${node.type}'`);
    }
  })
);

const generatePrintStr = (tree) => {
  const arrayOfStrings = generateDifStrings('', tree);

  const printString = _.flattenDeep(arrayOfStrings).join('\n');

  return printString;
};

export default generatePrintStr;
