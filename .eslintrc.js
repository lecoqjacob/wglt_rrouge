const path = require('path');

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  env: {
    es6: true,
    jest: true,
    node: true,
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:jest-formatting/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
    project: path.resolve(__dirname, './tsconfig.json'),
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    quotes: ['error', 'single', 'avoid-escape'],
    'prettier/prettier': ['error', require('./.prettierrc')],
    'no-console': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: false,
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      },
    ],
    "no-restricted-syntax": [
      "error",
      {
        selector:
          "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace|group|groupEnd|groupCollapsed)$/]",
        message: "Unexpected property on console object was called",
      },
    ],
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/order': [
      'error',
      {
        groups: [
          'type',
          'builtin',
          'external',
          'internal',
          ['sibling', 'parent'],
          'index',
          'object',
        ],
        pathGroups: [
          {
            pattern: '@/types',
            group: 'type',
            position: 'after',
          },
          {
            pattern: '@/**',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: [],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  overrides: [
    {
      files: ['*.json'],
      rules: {
        quotes: ['error', 'double'],
      },
    },
    {
      files: ['*.js', '*.jsx'],
      rules: {
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
      },
    },
  ],
};
