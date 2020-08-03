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

const parseIni = (data) => {
  const parcedData = ini.parse(data);
  return makeNumbersFromStrings(parcedData);
};

const parse = (format) => {
  if (format === 'json') {
    return JSON.parse;
  }

  if (format === 'yml' || format === 'yaml') {
    return yaml.safeLoad;
  }

  if (format === 'ini') {
    return parseIni;
  }

  if (format === 'txt') {
    return (data) => data;
  }
  return new Error(`Wrong file format: '${format}'. Correct format is one of [json, yml, ini]`);
};

export default parse;
