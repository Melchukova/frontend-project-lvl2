import _ from 'lodash';
import fs from 'fs';

const getJSONObjectFromPath = (path) => {
  const fileContent = fs.readFileSync(path);
  const object = JSON.parse(fileContent);
  return object;
};

const findDifference = (filepath1, filepath2) => {
  const obj1 = getJSONObjectFromPath(filepath1);
  const obj2 = getJSONObjectFromPath(filepath2);

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
  const resultForPrint = `{\n${differenceStr}\n}`;

  console.log(resultForPrint);
};

export default findDifference;
