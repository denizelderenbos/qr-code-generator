import fs from 'node:fs/promises';
import path from 'node:path';
import { STUBS_DIR } from './paths';

/**
 * Leest een stub uit STUBS_DIR en vult de placeholders in.
 * Een placeholder ziet eruit als {{ naam }}.
 *
 * renderStub('command', { className: 'QrGenerateCommand' })
 */
export async function renderStub(
    name: string,
    values: Record<string, string>,
): Promise<string> {
    const file = path.join(STUBS_DIR, `${name}.stub`);
    const stub = await fs.readFile(file, 'utf8');

    return stub.replace(/{{\s*(\w+)\s*}}/g, (placeholder, key: string) => {
        const value = values[key];
        if (value === undefined) {
            throw new Error(`No value for ${placeholder} in ${file}`);
        }
        return value;
    });
}
