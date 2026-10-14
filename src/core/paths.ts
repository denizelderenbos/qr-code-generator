import path from 'node:path';

/** Interne commands van het framework, zoals make:command. */
export const CORE_COMMANDS_DIR = path.join(import.meta.dirname, 'commands');

/** Commands van de applicatie. */
export const APP_COMMANDS_DIR = path.join(
    import.meta.dirname,
    '..',
    'commands',
);

/** Templates (stubs) waarmee make:* commands nieuwe bestanden maken. */
export const STUBS_DIR = path.join(import.meta.dirname, 'stubs');
