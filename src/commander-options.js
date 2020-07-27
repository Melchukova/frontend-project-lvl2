import commander from 'commander';
import packageJson from '../package.json';
import findDifference from './find-difference.js';
import getPrintStr from './stylish.js';

const { program } = commander;

const getDifference = (filepath1, filepath2) => {
  const resultForPrint = findDifference(filepath1, filepath2);
  console.log(resultForPrint);
};

const useCommander = () => {
  program
    .description(packageJson.description)
    .version(packageJson.version, '-V, --version', 'output the version number')
    .helpOption('-h, --help', 'output usage information')
    .option('-f, --format [type]', 'output format', getPrintStr)
    .arguments('<filepath1> <filepath2>')
    .action((filepath1, filepath2) => getDifference(filepath1, filepath2));

  program.parse(process.argv);
};

export default useCommander;
