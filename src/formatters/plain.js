import _ from 'lodash';

const stringify = (val) => {
  if (_.isObject(val)) return '[complex value]';
  if (_.isString(val)) return `'${val}'`;
  return val;
};

const generateDifStrings = (path, arr) => (
  arr.map((obj) => {
    switch (obj.type) {
      case 'unchanged':
        return [];
      case 'added':
        return `Property '${path}${obj.key}' was added with value: ${stringify(obj.value2)}`;
      case 'removed':
        return `Property '${path}${obj.key}' was removed`;
      case 'changed':
        return `Property '${path}${obj.key}' was updated. From ${stringify(obj.value1)} to ${stringify(obj.value2)}`;
      case 'nested':
        return generateDifStrings(`${path}${obj.key}.`, obj.child);
      default:
        return new Error(`Wrong node type: '${obj.type}'`);
    }
  })
);

const generatePrintStr = (tree) => {
  const arrOfStr = generateDifStrings('', tree);

  const printString = _.flattenDeep(arrOfStr).join('\n');

  return printString;
};

export default generatePrintStr;
