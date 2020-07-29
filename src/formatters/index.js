import stylish from './stylish.js';
import plain from './plain.js';

const getFormatter = (format) => {
  switch (format) {
    case 'stylish':
      return stylish;
    case 'plain':
      return plain;
    default:
      throw new Error(`Wrong format '${format}'. Correct format is one of [stylsh, plain]`);
  }
};

export default getFormatter;
