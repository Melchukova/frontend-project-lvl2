import yaml from 'js-yaml';
import ini from 'ini';
import _ from 'lodash';

const numberfyValues = (obj) => (
  _.mapValues(obj, (value) => (
    _.isObject(value) ? numberfyValues(value) : parseFloat(value) || value
  ))
);

const parse = (data, format) => {
  switch (format) {
    case 'json':
      return JSON.parse(data);
    case 'yml':
    case 'yaml':
      return yaml.safeLoad(data);
    case 'ini': {
      return numberfyValues(ini.parse(data));
    }
    default:
      return new Error(`Wrong input format: '${format}'`);
  }
};

export default parse;
