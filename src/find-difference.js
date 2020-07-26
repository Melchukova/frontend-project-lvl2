import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import getParser from './parsers.js';

const getObjectFromPath = (filePath) => {
  const content = fs.readFileSync(filePath);
  const format = path.extname(filePath);
  const parse = getParser(format);
  return parse(content);
};

const findDifference = (filepath1, filepath2) => {
  const obj1 = getObjectFromPath(filepath1);

  const obj2 = getObjectFromPath(filepath2);

  const entries1 = Object.entries(obj1);
  const entries2 = Object.entries(obj2);

  const differenceObj1 = entries1.reduce((acc, [key, value]) => {
    const value2 = obj2[key];
    if (_.isEmpty(value2)) return acc.concat({ diff: '-', key, value });
    if (value2 === value) return acc.concat({ diff: ' ', key, value });
    if (value2 !== value) return acc.concat({ diff: '-', key, value });
    return acc;
  }, []);

  const differenceObj2 = entries2.reduce((acc, [key, value]) => {
    const value1 = obj1[key];
    if (_.isEmpty(value1)) return acc.concat({ diff: '+', key, value });
    if (value1 !== value) return acc.concat({ diff: '+', key, value });
    return acc;
  }, []);

  const differenceObj = differenceObj1.concat(differenceObj2).sort((a, b) => {
    if (a.key > b.key) return 1;
    return -1;
  });

  const differenceStr = differenceObj.map((obj) => `  ${obj.diff} ${obj.key}: ${obj.value}`).join('\n');

  return `{\n${differenceStr}\n}`;
};

export default findDifference;
