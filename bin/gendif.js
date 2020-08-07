#!/usr/bin/env -S node --experimental-json-modules --no-warnings
import program from 'commander';
import packageJson from '../package.json';
import genDif from '../index.js';

program
  .description(packageJson.description)
  .version(packageJson.version, '-V, --version', 'output the version number')
  .helpOption('-h, --help', 'output usage information')
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2, options) => {
    const difference = genDif(filepath1, filepath2, options.format);
    console.log(difference);
  });

program.parse(process.argv);
