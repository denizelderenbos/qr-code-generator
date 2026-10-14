/**
 * index.ts
 *   └─ registreert command-classes in een Kernel (registry)
 *         └─ Kernel vertaalt elke class naar een commander-command
 *               └─ commander leest argv, kiest het command op naam
 *                     └─ new TestCommand().run()
 */
import Kernel from './src/core/kernel';
import { argv } from 'node:process';
import path from 'node:path';
import { UserError } from './src/core/errors';
import { loadCommands } from './src/core/command-loader';
import { CommanderError } from 'commander';
import { APP_COMMANDS_DIR, CORE_COMMANDS_DIR } from './src/core/paths';

async function main() {
    const commands = await loadCommands(APP_COMMANDS_DIR, CORE_COMMANDS_DIR);
    const kernel = new Kernel(commands);
    await kernel.handle(argv);
}

try {
    await main();
} catch (e) {
    if (e instanceof UserError) {
        console.error(e.message);
        process.exitCode = 1;
    } else if (e instanceof CommanderError) {
        process.exitCode = e.exitCode;
    } else {
        console.error('Caught exception:', e);
        process.exitCode = 1;
    }
}
