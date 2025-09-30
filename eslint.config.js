// ESLint v9 Flat Config
import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'node_modules/**',
      'frontend/dist/**',
      'playwright-report/**',
      'test-results/**',
      'cdk.out/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  // Frontend (browser)
  {
    files: ['frontend/src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        AbortController: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        matchMedia: 'readonly',
        queueMicrotask: 'readonly',
        __REACT_DEVTOOLS_GLOBAL_HOOK__: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
      'react-hooks': reactHooks,
      import: importPlugin,
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': { typescript: { project: ['./tsconfig.frontend.json'] } },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  // Infra (node)
  {
    files: ['infra/cdk/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { process: 'readonly', module: 'readonly', require: 'readonly' },
    },
    plugins: { '@typescript-eslint': tseslint.plugin, import: importPlugin },
    settings: { 'import/resolver': { typescript: { project: ['./tsconfig.cdk.json'] } } },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  // Tests (node)
  {
    files: ['tests/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { process: 'readonly' },
    },
    plugins: { '@typescript-eslint': tseslint.plugin },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
];
