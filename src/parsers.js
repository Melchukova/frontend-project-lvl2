import yaml from 'js-yaml';
import ini from 'ini';

const parse = (format) => {
  if (format === '.json') {
    return JSON.parse;
  }

  if (format === '.yml' || format === '.yaml') {
    return yaml.safeLoad;
  }

  if (format === '.ini') {
    return ini.parse;
  }

  return new Error('Incorrect file format');
};

export default parse;
