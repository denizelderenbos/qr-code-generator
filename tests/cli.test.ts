import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const root = path.join(import.meta.dirname, '..');
const tsx = path.join(root, 'node_modules', '.bin', 'tsx');

/** Draait de CLI zoals een gebruiker dat doet, als apart proces. */
function cli(...args: string[]) {
    const result = spawnSync(tsx, ['index.ts', ...args], {
        cwd: root,
        encoding: 'utf8',
    });

    return {
        exitCode: result.status,
        stdout: result.stdout,
        stderr: result.stderr,
    };
}

describe('CLI (end-to-end)', () => {
    test('een bestaand command draait en eindigt met exit code 0', () => {
        const { exitCode, stdout } = cli('test:test');

        assert.equal(exitCode, 0);
        assert.match(stdout, /hello world/);
    });

    test('--help toont de commands en eindigt met exit code 0', () => {
        const { exitCode, stdout } = cli('--help');

        assert.match(stdout, /test:test/);
        assert.equal(exitCode, 0, 'help is geen fout');
    });

    test('een onbekend command eindigt met exit code 1', () => {
        const { exitCode } = cli('typfout');

        assert.equal(exitCode, 1);
    });

    test('een onbekend command geeft een nette melding op stderr, zonder stacktrace', () => {
        const { stdout, stderr } = cli('typfout');

        assert.match(stderr, /unknown command 'typfout'/);
        assert.doesNotMatch(
            stderr,
            /\n\s+at /,
            'geen stacktrace voor een gebruikersfout',
        );
        assert.equal(stdout, '', 'een foutmelding hoort niet op stdout');
    });

    test('de melding over een onbekend command verschijnt maar één keer', () => {
        const { stderr } = cli('typfout');

        assert.equal(stderr.match(/unknown command/g)?.length, 1);
    });
});
