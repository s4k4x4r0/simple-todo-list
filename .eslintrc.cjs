module.exports = {
  root: true,
  env: { browser: true, es2023: true, node: true },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime',
    'prettier',
  ],
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      typescript: {
        project: ['tsconfig.frontend.json', 'tsconfig.cdk.json'],
      },
    },
  },
  ignorePatterns: ['dist/', 'node_modules/', 'playwright-report/', 'test-results/'],
  overrides: [
    {
      files: ['frontend/src/**/*.{ts,tsx}'],
      parserOptions: {
        project: ['./tsconfig.frontend.json'],
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'react/react-in-jsx-scope': 'off',
      },
    },
    {
      files: ['infra/cdk/**/*.{ts,tsx}'],
      parserOptions: {
        project: ['./tsconfig.cdk.json'],
        tsconfigRootDir: __dirname,
      },
    },
    {
      files: ['tests/**/*.{ts,tsx}'],
      parserOptions: {
        project: ['./tsconfig.frontend.json'],
        tsconfigRootDir: __dirname,
      },
      env: { node: true },
    },
  ],
};
