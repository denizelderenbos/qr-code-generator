import { afterEach, beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import MakeCommand from '../src/core/commands/make_command';
import { loadCommands } from '../src/core/command-loader';
import { UserError } from '../src/core/errors';

let tmp: string;

beforeEach(async () => {
    // Naast src/commands, zodat de import '../core/command' in het
    // gegenereerde bestand naar dezelfde BaseCommand wijst als in het echt.
    const src = path.join(import.meta.dirname, '..', 'src');
    tmp = await fs.mkdtemp(path.join(src, '.make-command-test-'));
});

afterEach(async () => {
    await fs.rm(tmp, { recursive: true, force: true });
});

/** Draait make:command alsof de gebruiker `qr make:command <name>` typte, maar dan in een tijdelijke map. */
async function make(name: string): Promise<void> {
    const command = new MakeCommand();
    command.newCommandName = name;
    command.targetDir = tmp;
    await command.run();
}

describe('make:command', () => {
    test('maakt een bestand waarvan de naam eindigt op command.ts', async () => {
        await make('qr:generate');

        assert.deepEqual(await fs.readdir(tmp), ['qr_generate_command.ts']);
    });

    test('het nieuwe bestand is een geldig command voor de loader', async () => {
        await make('qr:generate');

        const commands = await loadCommands(tmp);
        const Generated = commands.get('qr:generate');

        assert.ok(Generated, 'de loader vindt het command onder zijn naam');
        assert.equal(typeof new Generated().run, 'function');
    });

    test('overschrijft nooit een bestaand command', async () => {
        await make('greet');
        const before = await fs.readFile(
            path.join(tmp, 'greet_command.ts'),
            'utf8',
        );

        await assert.rejects(make('greet'), UserError);

        const after = await fs.readFile(
            path.join(tmp, 'greet_command.ts'),
            'utf8',
        );
        assert.equal(after, before);
    });

    test('weigert een ongeldige naam, en maakt dan geen bestand', async () => {
        for (const name of [
            '',
            'Greet',
            'qr generate',
            '../evil',
            'qr:',
            ':qr',
        ]) {
            await assert.rejects(
                make(name),
                UserError,
                `'${name}' moet geweigerd worden`,
            );
        }

        assert.deepEqual(await fs.readdir(tmp), []);
    });
});
