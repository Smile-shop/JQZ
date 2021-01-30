module.exports = {
  root: true,
  env: {
    node: true
  },
  
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],

  parserOptions: {
    parser: '@typescript-eslint/parser'
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'semi': 'off',
    'comma-dangle': 'off',
    'no-unused-vars': 'off',
    'vue/no-unused-vars': 'off',
    'space-before-function-paren': ["error", {
      "anonymous": "never",
      "named": "never",
      "asyncArrow": "always"
    }],
    'no-unneeded-ternary': 'off'
  },

  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript'
  ]
}
