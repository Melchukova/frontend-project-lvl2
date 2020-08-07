import genDiff from '../index.js';
import { buildPath, readFile } from '../src/fileReader.js';

const buildFixturePath = (filename) => buildPath('__fixtures__', filename);

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
    expect(stylishResult).toEqual(genDiff(file1Path, file2Path, 'stylish'));

    expect(plainResult).toEqual(genDiff(file1Path, file2Path, 'plain'));

    expect(jsonResult).toEqual(genDiff(file1Path, file2Path, 'json'));

    expect(stylishResult).toEqual(genDiff(file1Path, file2Path));
  });
});
