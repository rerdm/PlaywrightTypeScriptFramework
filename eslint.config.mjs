
import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      // TypeScript rules
      'no-unused-vars': 'off', // Turned off in favor of @typescript-eslint rule
      '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['tests/**/*.{js,ts}', '**/*.spec.{js,ts}', '**/*.test.{js,ts}'],
    rules: {
      // Playwright-specific rules can be more relaxed
      '@typescript-eslint/no-unused-vars': 'off',
    }
  },
  {
    ignores: [
      'node_modules/',
      'test-results/',
      'playwright-report/',
      'allure-results/',
      'allure-report/',
      'eslint-report.html',
      'debug-*.js',
      'test-credentials.js',
      '*.config.{js,mjs,ts}'
    ]
  }
];
