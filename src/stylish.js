import _ from 'lodash';

const generateArrFromObj = (indentsAmount, obj) => {
  const indent = ('  ').repeat(indentsAmount);
  const entries = Object.entries(obj);
  const resultArr = entries.reduce((arr, [key, val]) => {
    if (!_.isObject(val)) {
      return arr.concat(`${indent}${key}: ${val}`);
    }

    return arr.concat(
      `${indent}${key}: {`,
      ...generateArrFromObj(indentsAmount + 2, val),
      `${indent}  }`,
    );
  }, []);

  return resultArr;
};

const generatePrintStringForObject = (obj) => {
  const arr = ['{', ...generateArrFromObj(1, obj), '}'];
  const printString = arr.join('\n');

  return printString;
};

export default generatePrintStringForObject;