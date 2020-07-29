import commander from 'commander';
import packageJson from '../package.json';
import findDifference from './find-difference.js';

const { program } = commander;

const printDifference = (filepath1, filepath2, format) => {
  const difference = findDifference(filepath1, filepath2, format);
  console.log(difference);
};

const useCommander = () => {
  program
    .description(packageJson.description)
    .version(packageJson.version, '-V, --version', 'output the version number')
    .helpOption('-h, --help', 'output usage information')
    .option('-f, --format [type]', 'output format', 'stylish')
    .arguments('<filepath1> <filepath2>')
    .action((filepath1, filepath2, options) => {
      console.log('options', options.format);
      printDifference(filepath1, filepath2, options.format);
    });

  program.parse(process.argv);
};

export default useCommander;
