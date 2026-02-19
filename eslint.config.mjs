import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  // Базові JS правила
  js.configs.recommended,

  // TypeScript правила
  ...tseslint.configs.recommended,

  // Prettier конфіг (вимикає конфліктуючі правила)
  prettierConfig,

  // Загальні правила для всіх файлів
  {
    plugins: {
      prettier,
    },
    rules: {
      // Prettier форматування як ESLint правило
      'prettier/prettier': 'error',

      // Забороняє console.log (тільки warn щоб не блокувати)
      'no-console': 'warn',

      // Забороняє невикористані змінні
      'no-unused-vars': 'off', // вимикаємо базове, бо є TypeScript версія
      '@typescript-eslint/no-unused-vars': 'error',

      // Забороняє var, тільки let/const
      'no-var': 'error',

      // Вимагає const де можливо
      'prefer-const': 'error',
    },
  },

  // Правила ТІЛЬКИ для Playwright тестових файлів
  {
    ...playwright.configs['flat/recommended'],
    files: ['src/tests/playwright/**/*.ts'],
    plugins: {
      playwright,
    },
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-focused-test': 'error',
      'playwright/no-skipped-test': 'warn',
      'playwright/valid-expect': 'error',
      'playwright/expect-expect': 'off',
    },
  },

  {
    ignores: [
      'node_modules/**',
      'playwright-report/**',
      'test-results-playwright/**',
      'allure-results/**',
      'allure-report/**',
      'dist/**',
      'wdio.conf.js',
    ],
  },
];
