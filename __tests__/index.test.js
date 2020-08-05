import compareFiles from '../index.js';
import { getPath, readFile } from '../src/fileReader.js';

const getFixturePath = (filename) => getPath(filename, '__fixtures__');

const readFixtre = (name) => {
  const path = getFixturePath(name);
  return readFile(path);
};

const inputFormats = ['json', 'yml', 'ini'];
const extTbl = inputFormats.map((ext) => {
  const file1Path = getFixturePath(`file1.${ext}`);
  const file2Path = getFixturePath(`file2.${ext}`);
  return [ext, file1Path, file2Path];
});

describe('gendif', () => {
  const stylishResult = readFixtre('stylishResult.txt');
  const plainResult = readFixtre('plainResult.txt');
  const jsonResult = readFixtre('jsonResult.txt');

  test.each(extTbl)('input format: %s', (ext, file1Path, file2Path) => {
    const stylishDifference = compareFiles(file1Path, file2Path, 'stylish');
    expect(stylishResult).toEqual(stylishDifference);

    const plainDifference = compareFiles(file1Path, file2Path, 'plain');
    expect(plainResult).toEqual(plainDifference);

    const jsonDifference = compareFiles(file1Path, file2Path, 'json');
    expect(jsonResult).toEqual(jsonDifference);
  });
});
