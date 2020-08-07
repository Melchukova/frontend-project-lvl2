import _ from 'lodash';

const stringify = (value) => {
  if (_.isObject(value)) return '[complex value]';
  if (_.isString(value)) return `'${value}'`;
  return value;
};

const formatTree = (path, tree) => (
  tree.flatMap((node) => {
    switch (node.type) {
      case 'unchanged':
        return null;
      case 'added':
        return `Property '${path}${node.key}' was added with value: ${stringify(node.value2)}`;
      case 'removed':
        return `Property '${path}${node.key}' was removed`;
      case 'changed':
        return `Property '${path}${node.key}' was updated. From ${stringify(node.value1)} to ${stringify(node.value2)}`;
      case 'nested':
        return formatTree(`${path}${node.key}.`, node.child);
      default:
        return new Error(`Wrong node type: '${node.type}'`);
    }
  })
);

const generateString = (tree) => {
  const arrayOfStrings = formatTree('', tree);

  return arrayOfStrings.filter((string) => string !== null).join('\n');
};

export default generateString;
