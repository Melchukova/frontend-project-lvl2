import compareFiles from '../index.js';
import getParsedFileContent, { getPath } from '../src/fileReader.js';

const getFixturePath = (filename) => getPath(filename, '__fixtures__');

const getFile = (name) => {
  const path = getFixturePath(name);
  return getParsedFileContent(path);
};

describe('compare files', () => {
  const resultFormats = ['stylish', 'plain', 'json'];
  const resultExtensions = ['json', 'yml', 'ini'];

  const formatTbl = resultFormats.map((format) => {
    const result = getFile(`${format}Result.txt`);
    return [format, result];
  });

  const extTbl = resultExtensions.map((ext) => {
    const file1Path = getFixturePath(`file1.${ext}`);
    const file2Path = getFixturePath(`file2.${ext}`);
    return [ext, file1Path, file2Path];
  });

  describe.each(formatTbl)('print format: %s', (format, result) => {
    test.each(extTbl)('files extension: %s', (ext, file1Path, file2Path) => {
      const difference = compareFiles(file1Path, file2Path, format);

      expect(result).toEqual(difference);
    });
  });
});
