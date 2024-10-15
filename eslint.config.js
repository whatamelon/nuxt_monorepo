const nx = require('@nx/eslint-plugin');

module.exports = [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.vue'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {
      'import/extensions': 'off',
      'import/no-unresolved': 'off',
      'import/no-extraneous-dependencies': 'warn',
      'import/prefer-default-export': 'off',
      'vue/multi-word-component-names': 'off',
      'no-shadow': 0,
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'no-debugger': 'error',
      'no-use-before-define': ['error', { functions: false, variables: false }],
      'no-undef': 'off',
      'no-restricted-globals': ['off'],
      'consistent-return': 'off',
      'no-plusplus': 'off',
      'prefer-destructuring': 'off',
      camelcase: 'warn',
      curly: 'error',
      eqeqeq: 'error',
      'no-param-reassign': ['error', { props: false }],
      'vue/no-multiple-template-root': 'off',
      'prettier/prettier': [
        'error',
        {
          arrowSpacing: ['error', { before: true, after: true }],
          singleQuote: true,
          semi: false,
          useTabs: false,
          tabWidth: 2,
          trailingComma: 'none',
          printWidth: 200,
          bracketSpacing: true,
          arrowParens: 'always',
          endOfLine: 'auto'
        }
      ],
      'global-require': 0,
      'no-underscore-dangle': ['error', { allow: ['_data'] }]
    },
  },
];
