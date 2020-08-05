import yaml from 'js-yaml';
import ini from 'ini';
import _ from 'lodash';

const makeNumbersFromStrings = (obj) => (
  _.mapValues(obj, (value) => {
    if (_.isObject(value)) {
      return makeNumbersFromStrings(value);
    }
    // eslint-disable-next-line eqeqeq
    if (_.isString(value) && +value == value) {
      return +value;
    }
    return value;
  })
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
