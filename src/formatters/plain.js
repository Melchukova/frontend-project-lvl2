import _ from 'lodash';

const generateValStr = (val) => {
  if (_.isObject(val)) return '[complex value]';
  if (typeof val === 'string') return `'${val}'`;
  return val;
};

const generateDifStrings = (path, arr) => (
  arr.map((obj) => {
    if (obj.type === 'added') {
      return `Property '${path}${obj.key}' was added with value: ${generateValStr(obj.value2)}`;
    }

    if (obj.type === 'removed') {
      return `Property '${path}${obj.key}' was removed`;
    }

    if (obj.type === 'changed') {
      return `Property '${path}${obj.key}' was updated. From ${generateValStr(obj.value1)} to ${generateValStr(obj.value2)}`;
    }

    if (obj.type === 'nested') {
      const newPath = `${path}${obj.key}.`;
      return generateDifStrings(newPath, obj.child);
    }

    return [];
  })
);

const generatePrintStr = (tree) => {
  const arrOfStr = generateDifStrings('', tree);

  const printString = _.flattenDeep(arrOfStr).join('\n');

  return printString;
};

export default generatePrintStr;
