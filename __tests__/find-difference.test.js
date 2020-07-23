import findDifference from '../src/find-difference.js';
// import { dirname } from 'path';

describe('find difference', () => {
  test('for JSON', () => {
    // const __dirname =
    const filepath1 = '__fixtures__/file1.json';
    const filepath2 = '__fixtures__/file2.json';
    const difference = findDifference(filepath1, filepath2);
    expect(difference).toMatch('- follow: false');
    expect(difference).toMatch('  host: hexlet.io');
    expect(difference).toMatch('- proxy: 123.234.53.22');
    expect(difference).toMatch('+ timeout: 20');
    expect(difference).toMatch('+ verbose: true');
  });
});
