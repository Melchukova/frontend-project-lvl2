import _ from 'lodash';

const compareObjects = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  return _.union(keys1, keys2)
    .sort()
    .map((key) => {
      const value1 = obj1[key];
      const value2 = obj2[key];

      if (!_.has(obj2, key)) {
        return { key, value1, type: 'removed' };
      }

      if (!_.has(obj1, key)) {
        return { key, value2, type: 'added' };
      }

      if (_.isObject(value1) && _.isObject(value2)) {
        const comparedValues = compareObjects(value1, value2);
        return { key, child: comparedValues, type: 'nested' };
      }

      if (value1 !== value2) {
        return {
          key, value1, value2, type: 'changed',
        };
      }

      return {
        key, value1, value2, type: 'unchanged',
      };
    });
};

export default compareObjects;
