/*
 * Stap 1: krijg het voorbeeld werkend
 * Stap 2: ontwerp een Command class die het voorbeeld uitvoert
 * Stap 3: Maak custom command
 */
import { Command } from 'commander';
const program = new Command();

/**
 $ node string-util.js help split
 Usage: string-util split [options] <string>

 Split a string into substrings and display as an array.

 Arguments:
 string                  string to split

 Options:
 --first                 display just the first substring
 -s, --separator <char>  separator character (default: ",")
 -h, --help              display help for command

 $ node string-util.js split --separator=- a-b-c
 [ 'a', 'b', 'c' ]
 */

program
    .name('string-util')
    .description('CLI to some JavaScript string utilities')
    .version('0.8.0');

program
    .command('split')
    .description('Split a string into substrings and display as an array')
    .argument('<string>', 'string to split')
    .option('--first', 'display just the first substring')
    .option('-s, --separator <char>', 'separator character', ',')
    .action((str, options) => {
        const limit = options.first ? 1 : undefined;
        console.log(str.split(options.separator, limit));
    });

program.parse();
