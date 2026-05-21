import globals from 'globals'
import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'

export default [
  // Base JS recommended rules
  js.configs.recommended,

  // JSX accessibility rules
  jsxA11y.flatConfigs.recommended,

  // React + Hooks rules
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // React — new JSX transform means no React import needed
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-vars': 'error',         // Prevent false "unused" on JSX components
      'react/prop-types': 'off',              // Not using PropTypes in this project
      'react/jsx-no-target-blank': 'error',
      'react/jsx-key': 'error',
      'react/no-unescaped-entities': 'warn',

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // General quality
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^[A-Z]' }],
      'no-console': 'warn',
      'prefer-const': 'error',

      // Accessibility — keep recommended, soften a few interactive-element rules
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    },
  },

  // Ignore build output
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
]
