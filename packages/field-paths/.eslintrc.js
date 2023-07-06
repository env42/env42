module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.dev.json',
    tsconfigRootDir: __dirname,
    sourceType: 'commonjs',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'unused-imports',
    'import',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist'],
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'arrow-body-style': ['error', 'as-needed'],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'unused-imports/no-unused-imports': 1,
    '@typescript-eslint/no-unused-vars': [1, { vars: 'all', argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: false }],
    'no-param-reassign': [2, { props: false }],
    'comma-dangle': ['error', 'always-multiline'],
    '@typescript-eslint/no-non-null-assertion': 'off',
    'brace-style': ['error', '1tbs', { allowSingleLine: false }],
    'linebreak-style': ['error', 'unix'],
    'consistent-return': 1,
    curly: ['error', 'all'],
    'import/extensions': ['error', 'ignorePackages', {
      ts: 'never',
      tsx: 'never',
    }],
    'space-before-function-paren': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: [
          '.ts',
          '.js',
          '.json',
        ],
      },
      typescript: {},
    },
  },
};
