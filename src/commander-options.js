import { program } from 'commander';
import { version } from '../package.json';
import findDifference from './find-difference.js';

const useCommander = () => {
  program
    .description('Compares two configuration files and shows a difference.')
    .version(version, '-V, --version', 'output the version number')
    .helpOption('-h, --help', 'output usage information')
    .option('-f, --format [type]', 'output format')
    .arguments('<filepath1> <filepath2>')
    .action((filepath1, filepath2) => findDifference(filepath1, filepath2));

  program.parse(process.argv);
};

export default useCommander;
