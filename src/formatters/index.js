import stylish from './stylish.js';
import plain from './plain.js';

const format = (data, outputFormat) => {
  switch (outputFormat) {
    case 'stylish':
      return stylish(data);
    case 'plain':
      return plain(data);
    case 'json':
      return JSON.stringify(data);
    default:
      throw new Error(`Wrong format '${outputFormat}'. Correct format is one of [stylsh, plain]`);
  }
};

export default format;
