import formatStylish from './stylish.js';
import formatPlain from './plain.js';

const format = (data, outputFormat) => {
  switch (outputFormat) {
    case 'stylish':
      return formatStylish(data);
    case 'plain':
      return formatPlain(data);
    case 'json':
      return JSON.stringify(data);
    default:
      throw new Error(`Wrong output format '${outputFormat}`);
  }
};

export default format;
