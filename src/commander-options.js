import { program } from 'commander';
import { version } from '../package.json';
import findDifference from './find-difference.js';

const getDifference = (filepath1, filepath2) => {
  const resultForPrint = findDifference(filepath1, filepath2);
  console.log(resultForPrint);
};

const useCommander = () => {
  program
    .description('Compares two configuration files and shows a difference.')
    .version(version, '-V, --version', 'output the version number')
    .helpOption('-h, --help', 'output usage information')
    .option('-f, --format [type]', 'output format')
    .arguments('<filepath1> <filepath2>')
    .action((filepath1, filepath2) => getDifference(filepath1, filepath2));

  program.parse(process.argv);
};

export default useCommander;
