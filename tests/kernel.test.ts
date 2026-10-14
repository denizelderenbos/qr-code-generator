import { beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import Kernel from '../src/core/kernel';
import BaseCommand, { type CommandClass } from '../src/core/command';

/** Houdt bij wat de nep-commands hebben gedaan. */
const calls: string[] = [];

class FirstCommand extends BaseCommand {
    static commandName = 'first';
    static description = 'Eerste nep-command';

    constructor() {
        super();
        calls.push('first:constructor');
    }

    run(): Promise<void> {
        calls.push('first:run');
        return Promise.resolve();
    }
}

class SecondCommand extends BaseCommand {
    static commandName = 'second';
    static description = 'Tweede nep-command';

    constructor() {
        super();
        calls.push('second:constructor');
    }

    run(): Promise<void> {
        calls.push('second:run');
        return Promise.resolve();
    }
}

class FailingCommand extends BaseCommand {
    static commandName = 'failing';
    static description = 'Gooit een fout, na even wachten';

    async run(): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 10));
        throw new Error('kapot');
    }
}

function kernelWith(...classes: CommandClass[]): Kernel {
    return new Kernel(new Map(classes.map((cls) => [cls.commandName, cls])));
}

/** Zoals process.argv: eerst node en het script, daarna wat de gebruiker typt. */
function argv(...userArgs: string[]): string[] {
    return ['node', 'qr', ...userArgs];
}

describe('Kernel', () => {
    beforeEach(() => {
        calls.length = 0;
    });

    test('voert run() uit van het gekozen command', async () => {
        await kernelWith(FirstCommand, SecondCommand).handle(argv('second'));

        assert.deepEqual(calls, ['second:constructor', 'second:run']);
    });

    test('maakt alleen een instantie van het gekozen command', async () => {
        await kernelWith(FirstCommand, SecondCommand).handle(argv('first'));

        assert.ok(!calls.includes('second:constructor'));
    });

    test('maakt bij elke aanroep een nieuwe instantie', async () => {
        const kernel = kernelWith(FirstCommand);

        await kernel.handle(argv('first'));
        await kernel.handle(argv('first'));

        assert.deepEqual(calls, [
            'first:constructor',
            'first:run',
            'first:constructor',
            'first:run',
        ]);
    });

    test('twee kernels met dezelfde commands zitten elkaar niet in de weg', async () => {
        await kernelWith(FirstCommand).handle(argv('first'));
        await kernelWith(FirstCommand).handle(argv('first'));

        assert.equal(calls.filter((c) => c === 'first:run').length, 2);
    });

    test('wacht tot run() klaar is en geeft een fout daaruit door', async () => {
        await assert.rejects(
            kernelWith(FailingCommand).handle(argv('failing')),
            {
                message: 'kapot',
            },
        );
    });

    test('een onbekend command stopt het proces niet, maar geeft een fout', async () => {
        // Zonder exitOverride() roept commander process.exit aan, en stopt deze testrun.
        await assert.rejects(kernelWith(FirstCommand).handle(argv('typfout')));
    });
});
