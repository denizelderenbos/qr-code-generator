import fs from 'node:fs/promises';
import path from 'node:path';
import BaseCommand, { type CommandArg } from '../command';
import { UserError } from '../errors';
import { APP_COMMANDS_DIR } from '../paths';
import { renderStub } from '../stub';

/** Toegestaan: kleine letters, cijfers en '-', in delen gescheiden door ':' (bijv. 'qr:generate'). */
const VALID_NAME = /^[a-z][a-z0-9-]*(:[a-z][a-z0-9-]*)*$/;

export default class MakeCommand extends BaseCommand {
    static commandName = 'make:command';
    static description = 'Make a new command';

    static args: CommandArg[] = [
        {
            name: 'newCommandName',
            description: "The name of the new command, e.g. 'qr:generate'",
        },
    ];

    declare newCommandName: string;

    /** De map waarin het nieuwe command komt. Tests kunnen dit overschrijven. */
    targetDir = APP_COMMANDS_DIR;

    async run() {
        // TODO add optional description parameter
        const name = this.newCommandName;

        if (!VALID_NAME.test(name)) {
            throw new UserError(
                `Invalid command name '${name}'. Use lowercase letters, digits and '-', separated by ':' (e.g. 'qr:generate').`,
            );
        }

        const file = path.join(this.targetDir, toFileName(name));
        const contents = await renderStub('command', {
            className: toClassName(name),
            commandName: name,
        });

        try {
            // 'wx': maak het bestand aan, maar faal als het al bestaat.
            await fs.writeFile(file, contents, { flag: 'wx' });
        } catch (e) {
            if (e instanceof Error && 'code' in e && e.code === 'EEXIST') {
                throw new UserError(`${file} already exists.`);
            }
            throw e;
        }

        console.log(`Created ${path.relative(process.cwd(), file)}`);
    }
}

/** 'qr:generate' → ['qr', 'generate']; 'qr-code' → ['qr', 'code'] */
function toWords(name: string): string[] {
    return name.split(/[:-]/);
}

/** 'qr:generate' → 'qr_generate_command.ts' (de loader zoekt naar '...command.ts') */
function toFileName(name: string): string {
    return `${toWords(name).join('_')}_command.ts`;
}

/** 'qr:generate' → 'QrGenerateCommand' */
function toClassName(name: string): string {
    const pascal = toWords(name)
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join('');
    return `${pascal}Command`;
}
