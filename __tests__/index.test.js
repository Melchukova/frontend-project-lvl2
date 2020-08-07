import genDif from '../index.js';
import { buildPath, readFile } from '../src/fileReader.js';

const buildFixturePath = (filename) => buildPath(`__fixtures__/${filename}`);

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
    const stylishDifference = genDif(file1Path, file2Path, 'stylish');
    expect(stylishResult).toEqual(stylishDifference);

    const plainDifference = genDif(file1Path, file2Path, 'plain');
    expect(plainResult).toEqual(plainDifference);

    const jsonDifference = genDif(file1Path, file2Path, 'json');
    expect(jsonResult).toEqual(jsonDifference);

    const defaultDifference = genDif(file1Path, file2Path);
    expect(defaultDifference).toEqual(stylishDifference);
  });
});
