import compareFiles from '../index.js';
import getParsedFileContent, { getPath } from '../src/fileReader.js';

const getFixturePath = (filename) => getPath(filename, '__fixtures__');

const getFile = (name) => {
  const path = getFixturePath(name);
  return getParsedFileContent(path);
};

const outputFormats = ['stylish', 'plain', 'json'];
const inputFormats = ['json', 'yml', 'ini'];

const formatTbl = outputFormats.map((format) => {
  const result = getFile(`${format}Result.txt`);
  return [format, result];
});

const extTbl = inputFormats.map((ext) => {
  const file1Path = getFixturePath(`file1.${ext}`);
  const file2Path = getFixturePath(`file2.${ext}`);
  return [ext, file1Path, file2Path];
});

describe.each(formatTbl)('output format: %s', (format, result) => {
  test.each(extTbl)('input format: %s', (ext, file1Path, file2Path) => {
    const difference = compareFiles(file1Path, file2Path, format);

    expect(result).toEqual(difference);
  });
});
