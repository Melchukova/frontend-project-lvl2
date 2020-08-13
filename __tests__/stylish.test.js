import { valueStringify } from '../src/formatters/stylish.js';
import { buildPath, readFile } from '../src/fileReader.js';

const buildFixturePath = (filename) => buildPath('__fixtures__', filename);

const readFixture = (name) => {
  const path = buildFixturePath(name);
  return readFile(path);
};

test('valueStringify', () => {
  const strResult = readFixture('valueStringifyResult.txt');
  const objFile = readFixture('file1.json');
  const obj = JSON.parse(objFile);
  expect(strResult).toEqual(valueStringify(obj, ' ', 2));
});
