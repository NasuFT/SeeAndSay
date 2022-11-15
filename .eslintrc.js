module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'airbnb/hooks', 'expo/native', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 14,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {},
};
