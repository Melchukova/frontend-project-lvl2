import yaml from 'js-yaml';
import ini from 'ini';
import _ from 'lodash';

const makeNumbersFromStrings = (obj) => (
  Object.entries(obj).reduce((newObj, [key, value]) => {
    if (!_.isObject(value)) {
      const num = Number(value);
      const isNum = !Number.isNaN(num) && typeof value === 'string';
      const newValue = isNum ? num : value;
      return { ...newObj, [key]: newValue };
    }

    return { ...newObj, [key]: makeNumbersFromStrings(value) };
  }, {})
);

const parse = (data, format) => {
  switch (format) {
    case 'json':
      return JSON.parse(data);
    case 'yml':
    case 'yaml':
      return yaml.safeLoad(data);
    case 'ini': {
      const parcedData = ini.parse(data);
      return makeNumbersFromStrings(parcedData);
    }
    default:
      return new Error(`Wrong file format: '${format}'. Correct format is one of [json, yml, ini]`);
  }
};

export default parse;
