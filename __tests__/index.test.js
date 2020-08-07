import genDiff from '../index.js';
import { buildPath, readFile } from '../src/fileReader.js';

const buildFixturePath = (filename) => buildPath(filename, '__fixtures__');

const readFixture = (name) => {
  const path = buildFixturePath(name);
  return readFile(path);
};

const inputFormats = ['json', 'yml', 'ini'];

describe('gendif', () => {
  const stylishResult = readFixture('stylishResult.txt');
  const plainResult = readFixture('plainResult.txt');
  const jsonResult = readFixture('jsonResult.txt');

  test.each(inputFormats)('input format: %s', (ext) => {
    const file1Path = buildFixturePath(`file1.${ext}`);
    const file2Path = buildFixturePath(`file2.${ext}`);
    const stylishDifference = genDiff(file1Path, file2Path, 'stylish');
    expect(stylishResult).toEqual(stylishDifference);

    const plainDifference = genDiff(file1Path, file2Path, 'plain');
    expect(plainResult).toEqual(plainDifference);

    const jsonDifference = genDiff(file1Path, file2Path, 'json');
    expect(jsonResult).toEqual(jsonDifference);

    const defaultDifference = genDiff(file1Path, file2Path);
    expect(defaultDifference).toEqual(stylishDifference);
  });
});
