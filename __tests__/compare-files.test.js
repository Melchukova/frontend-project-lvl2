import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import compareFiles from '../src/compare-files.js';
import readFile from '../src/file-reader.js';

let results;

const getFixturePath = (filename) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return join(__dirname, '..', '__fixtures__', filename);
};

const getFile = (name) => {
  const path = getFixturePath(name);
  return readFile(path);
};

beforeEach(() => {
  const resultFormats = ['stylish', 'plain', 'json'];

  results = resultFormats.reduce((obj, format) => {
    const result = getFile(`${format}-result.txt`);
    return { ...obj, [format]: result };
  }, {});
});

describe('compare files', () => {
  describe.each([
    ['stylish'], ['plain'], ['json'],
  ])('print format: %s', (format) => {
    test.each([
      ['json'], ['yml'], ['ini'],
    ])('files extension: %s', (ext) => {
      const file1Path = getFixturePath(`file1.${ext}`);
      const file2Path = getFixturePath(`file2.${ext}`);

      const difference = compareFiles(file1Path, file2Path, format);

      const result = results[format];
      expect(difference).toEqual(result);
    });
  });
});
