import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  // Astro files
  ...eslintPluginAstro.configs.recommended,

  // TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',

      // General best practices
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',

      // Security
      'no-script-url': 'error',
    },
  },

  // JavaScript files
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
    },
  },

  // Ignore patterns
  {
    ignores: ['dist/', 'node_modules/', '.astro/', 'playwright-report/', 'test-results/'],
  },
];
