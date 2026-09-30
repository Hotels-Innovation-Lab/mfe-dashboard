import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** Shared flat config. Consumers: `export { default } from '@mfe/config/eslint'`. */
export default tseslint.config(
  { ignores: ['dist', 'coverage', '@mf-types', '.turbo'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat['recommended-latest'] ?? reactHooks.configs['recommended-latest'],
  jsxA11y.flatConfigs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
);
