import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { renderStub } from '../src/core/stub';

describe('renderStub', () => {
    test('vult alle placeholders in', async () => {
        const result = await renderStub('command', {
            className: 'QrGenerateCommand',
            commandName: 'qr:generate',
        });

        assert.match(result, /class QrGenerateCommand extends BaseCommand/);
        assert.match(result, /static commandName = 'qr:generate'/);
        assert.doesNotMatch(result, /{{/, 'er blijft geen placeholder over');
    });

    test('een ontbrekende waarde geeft een fout met de naam van de placeholder', async () => {
        await assert.rejects(
            renderStub('command', { className: 'QrGenerateCommand' }),
            /commandName/,
        );
    });

    test('een stub die niet bestaat geeft een fout', async () => {
        await assert.rejects(renderStub('bestaat-niet', {}), {
            code: 'ENOENT',
        });
    });
});
