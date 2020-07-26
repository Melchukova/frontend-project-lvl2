import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import findDifference from '../src/find-difference.js';

let __filename;
let __dirname;
const fileExtensions = ['json', 'yml'];

beforeAll(() => {
  __filename = fileURLToPath(import.meta.url);
  __dirname = dirname(__filename);
});

const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);

describe('find difference', () => {
  fileExtensions.forEach((ext) => {
    test(`for ${ext}`, () => {
      const filepath1 = getFixturePath(`file1.${ext}`);
      const filepath2 = getFixturePath(`file2.${ext}`);
      const difference = findDifference(filepath1, filepath2);
      expect(difference).toMatch('- follow: false');
      expect(difference).toMatch('  host: hexlet.io');
      expect(difference).toMatch('- proxy: 123.234.53.22');
      expect(difference).toMatch('+ timeout: 20');
      expect(difference).toMatch('+ verbose: true');
    });
  });
});
