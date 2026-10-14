import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
    { ignores: ['node_modules', 'index-old.ts'] },
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: { allowDefaultProject: ['eslint.config.ts'] },
            },
        },
    },
    {
        // describe() en test() uit node:test geven een Promise terug,
        // maar de test runner wacht daar zelf op.
        files: ['tests/**/*.ts'],
        rules: {
            '@typescript-eslint/no-floating-promises': [
                'error',
                {
                    allowForKnownSafeCalls: [
                        {
                            from: 'package',
                            package: 'node:test',
                            name: ['describe', 'test', 'it', 'suite'],
                        },
                    ],
                },
            ],
        },
    },
    prettier,
);
