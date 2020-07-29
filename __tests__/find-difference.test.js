import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import findDifference from '../src/find-difference.js';

let __filename;
let __dirname;
const fileExtensions = ['json', 'yml', 'ini'];
const resultFormats = ['stylish', 'plain'];
let results;

const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);

const getFile = (name) => {
  const path = getFixturePath(name);
  return fs.readFileSync(path, 'utf-8');
};

beforeAll(() => {
  __filename = fileURLToPath(import.meta.url);
  __dirname = dirname(__filename);

  results = resultFormats.reduce((obj, format) => {
    const resultForFormat = getFile(`${format}-result.txt`);
    return { ...obj, [format]: resultForFormat };
  }, {});
});

describe('find difference', () => {
  resultFormats.forEach((format) => {
    fileExtensions.forEach((ext) => {
      test(`format: ${format}, extensions ${ext}`, () => {
        const beforeFilePath = getFixturePath(`before.${ext}`);
        const afterFilePath = getFixturePath(`after.${ext}`);
        const difference = findDifference(beforeFilePath, afterFilePath, format);
        const result = results[format];
        expect(difference).toEqual(result);
      });
    });
  });

  test('hexlet example', () => {
    const beforeFilePath = getFixturePath('hexlet-example/before.json');
    const afterFilePath = getFixturePath('hexlet-example/after.json');
    const hexResult = getFile('hexlet-example/result.txt');

    const difference = findDifference(beforeFilePath, afterFilePath, 'stylish');
    expect(difference).toEqual(hexResult);
  });
});
