import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import compareFiles from '../src/compare-files.js';
import compareObjects from '../src/compare-objects.js';
import readFile from '../src/file-reader.js';
import getParser from '../src/parsers.js';

let __filename;
let __dirname;

const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);

const getFile = (name) => {
  const path = getFixturePath(name);
  return readFile(path);
};

beforeAll(() => {
  __filename = fileURLToPath(import.meta.url);
  __dirname = dirname(__filename);
});

const getDataForTest = (diff, format) => {
  if (format !== 'json') {
    return diff;
  }

  const parce = getParser('json');
  const differenceObj = parce(diff);
  const result = getFile('json-result.json');
  return compareObjects(result, differenceObj, 'plain');
};

describe('find difference', () => {
  const fileExtensions = ['json', 'yml', 'ini'];
  const resultFormats = ['stylish', 'plain', 'json'];

  resultFormats.forEach((format) => {
    fileExtensions.forEach((ext) => {
      test(`format: ${format}, extensions ${ext}`, () => {
        const beforeFilePath = getFixturePath(`before.${ext}`);
        const afterFilePath = getFixturePath(`after.${ext}`);

        const difference = compareFiles(beforeFilePath, afterFilePath, format);
        const dataForTest = getDataForTest(difference, format);

        const result = getFile(`${format}-result.txt`);
        expect(dataForTest).toEqual(result);
      });
    });
  });

  test('hexlet example', () => {
    const beforeFilePath = getFixturePath('hexlet-example/before.json');
    const afterFilePath = getFixturePath('hexlet-example/after.json');
    const hexResult = getFile('hexlet-example/result.txt');

    const difference = compareFiles(beforeFilePath, afterFilePath, 'stylish');
    expect(difference).toEqual(hexResult);
  });
});
