import BaseCommand, { CommandClass } from './command';
import fs from 'node:fs';
import path from 'node:path';
import { UserError } from './errors';

export async function loadCommands(
    ...folders: string[]
): Promise<Map<string, CommandClass>> {
    const commands = new Map<string, CommandClass>();
    const sourceFiles = new Map<string, string>();
    const allFiles: string[] = [];

    for (const folder of folders) {
        if (!fs.existsSync(folder)) {
            throw new Error(
                `Could not find the commands folder: \`${folder}\``,
            );
        }
        for (const name of fs.readdirSync(folder)) {
            allFiles.push(path.join(folder, name));
        }
    }

    for (const file of allFiles) {
        // Only real command files
        if (!file.endsWith('command.js') && !file.endsWith('command.ts')) {
            continue;
        }

        const imported = (await import(file)) as {
            default: CommandClass;
        };

        // Check that the class was exported as default
        if (!Object.prototype.hasOwnProperty.call(imported, 'default')) {
            throw new UserError(`${file} doesn't have a default export`);
        }

        // Check that the default export extends BaseCommand
        const commandClass = imported.default as unknown;
        if (!(
            typeof commandClass === 'function' &&
            commandClass.prototype instanceof BaseCommand
        )) {
            throw new UserError(
                `${file}: the default export does not extend BaseCommand`,
            );
        }

        // Check if a duplicate commandName exists
        const commandName = imported.default.commandName;
        const existingFile = sourceFiles.get(commandName);
        if (existingFile !== undefined) {
            throw new UserError(
                `Duplicate commandName '${commandName}' in ${existingFile} and ${file}`,
            );
        }

        sourceFiles.set(commandName, file);
        commands.set(commandName, imported.default);
    }

    return new Map([...commands.entries()].sort());
}
