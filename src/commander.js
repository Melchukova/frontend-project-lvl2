const { program } = require('commander');
const { version } = require('../package.json');

export default () => {
  program
    .description('Compares two configuration files and shows a difference.')
    .version(version, '-V, --version',  'output the version number')
    .helpOption('-h, --help', 'output usage information')
    .option('-f, --format [type]', 'output format')
    .arguments('<filepath1> <filepath2>');

  program.parse(process.argv);
};