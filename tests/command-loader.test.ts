import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { loadCommands } from '../src/core/command-loader';

const fixtures = path.join(import.meta.dirname, 'fixtures');

/** Het pad naar een fixture-map met command-bestanden. */
function fixture(name: string): string {
    return path.join(fixtures, name);
}

/** Vangt de fout van een Promise die moet falen, zodat je de melding kunt controleren. */
async function errorOf(promise: Promise<unknown>): Promise<Error> {
    try {
        await promise;
    } catch (e) {
        assert.ok(e instanceof Error, 'er moet een Error gegooid worden');
        return e;
    }
    assert.fail('verwacht dat dit zou falen, maar het slaagde');
}

describe('loadCommands', () => {
    describe('geldige commands', () => {
        test('laadt elk command onder zijn commandName', async () => {
            const commands = await loadCommands(fixture('valid'));

            assert.deepEqual([...commands.keys()].sort(), ['bye', 'greet']);
            assert.equal(commands.get('greet')?.description, 'Zegt hallo');
        });

        test('de waarden zijn classes waarvan je een instantie kunt maken', async () => {
            const commands = await loadCommands(fixture('valid'));
            const Greet = commands.get('greet');

            assert.ok(Greet);
            assert.equal(typeof new Greet().run, 'function');
        });

        test('slaat bestanden over die geen command-bestand zijn', async () => {
            // In de map staan ook helper.ts en README.md.
            const commands = await loadCommands(fixture('valid'));

            assert.equal(commands.size, 2);
        });

        test('sorteert op commandName, niet op bestandsnaam', async () => {
            // a_command.ts heet 'zeta', b_command.ts heet 'alpha'.
            const commands = await loadCommands(fixture('unsorted'));

            assert.deepEqual([...commands.keys()], ['alpha', 'zeta']);
        });
    });

    describe('fouten', () => {
        test('een ontbrekende map geeft een fout met het gezochte pad', async () => {
            const folder = fixture('bestaat-niet');
            const error = await errorOf(loadCommands(folder));

            assert.match(error.message, new RegExp(escape(folder)));
        });

        test('een bestand zonder default export geeft een fout met de bestandsnaam', async () => {
            const error = await errorOf(
                loadCommands(fixture('no-default-export')),
            );

            assert.match(error.message, /broken_command\.ts/);
        });

        test('een default export die geen BaseCommand is geeft een fout met de bestandsnaam', async () => {
            const error = await errorOf(loadCommands(fixture('not-a-command')));

            assert.match(error.message, /plain_command\.ts/);
        });

        test('een dubbele commandName geeft een fout met beide bestandsnamen', async () => {
            const error = await errorOf(
                loadCommands(fixture('duplicate-name')),
            );

            assert.match(error.message, /same/);
            assert.match(error.message, /first_command\.ts/);
            assert.match(error.message, /second_command\.ts/);
        });
    });
});

/** Maakt een string veilig om letterlijk in een RegExp te gebruiken. */
function escape(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
