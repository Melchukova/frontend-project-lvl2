import yaml from 'js-yaml';

const parse = (format) => {
  if (format === '.json') {
    return JSON.parse;
  }

  if (format === '.yml') {
    return yaml.safeLoad;
  }

  return new Error('Incorrect file format');
};

export default parse;
