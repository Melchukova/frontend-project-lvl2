import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import findDifference from '../src/find-difference.js';

let __filename;
let __dirname;
const fileExtensions = ['json', 'yml', 'ini'];
let result;

const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);

beforeAll(() => {
  __filename = fileURLToPath(import.meta.url);
  __dirname = dirname(__filename);

  const resultPath = getFixturePath('result.txt');
  result = fs.readFileSync(resultPath, 'utf-8');
});

describe('find difference', () => {
  fileExtensions.forEach((ext) => {
    test(`for ${ext}`, () => {
      const beforeFilePath = getFixturePath(`before.${ext}`);
      const afterFilePath = getFixturePath(`after.${ext}`);
      const difference = findDifference(beforeFilePath, afterFilePath);
      expect(difference).toEqual(result);
    });
  });

  test('hexlet example', () => {
    const beforeFilePath = getFixturePath('hexlet-example/before.json');
    const afterFilePath = getFixturePath('hexlet-example/after.json');
    const resultPath = getFixturePath('hexlet-example/result.txt');
    result = fs.readFileSync(resultPath, 'utf-8');

    const difference = findDifference(beforeFilePath, afterFilePath);
    expect(difference).toEqual(result);
  });
});
