import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{ts,tsx}']
  },
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    }
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ]
    },
    ignores: ['dist']
  }
]