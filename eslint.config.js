const js = require('@eslint/js');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const importPlugin = require('eslint-plugin-import');
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y');
const globals = require('globals');

module.exports = [
    // Ignore patterns
    {
        ignores: ['dist/**', 'lib/**', 'node_modules/**', 'docs/demo.js'],
    },

    // Base recommended config
    js.configs.recommended,

    // React plugin configurations
    reactPlugin.configs.flat.recommended,
    reactPlugin.configs.flat['jsx-runtime'],

    // Global configuration for all files
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2021,
            },
        },
        plugins: {
            'react-hooks': reactHooksPlugin,
            import: importPlugin,
            'jsx-a11y': jsxA11yPlugin,
        },
        settings: {
            react: {
                version: '16.9',
            },
        },
        rules: {
            // React hooks rules
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',

            // Import plugin rules
            'import/no-unresolved': 'error',
            'import/named': 'error',
            'import/default': 'error',
            'import/namespace': 'error',

            // JSX a11y recommended rules
            ...jsxA11yPlugin.configs.recommended.rules,

            // Custom rules from original config
            'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
            yoda: ['error', 'always', { onlyEquality: true }],

            // Additional sensible defaults
            'react/prop-types': 'warn',
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        },
    },

    // Test files configuration
    {
        files: ['test/**/*.{js,jsx}', '**/*.spec.{js,jsx}', '**/*.test.{js,jsx}'],
        languageOptions: {
            globals: {
                ...globals.jest,
                mount: 'readonly',
                shallow: 'readonly',
            },
        },
        rules: {
            'no-console': 'off',
        },
    },
];
