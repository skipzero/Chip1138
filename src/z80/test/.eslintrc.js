module.exports = {
 extends: 'eslint:recommended',
  env: {
    browser: true,
    es6: true,
    mocha: true,
    node: true,
  },
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    // allow use of new operator when not part of the assignment or comparison
    // for constructor tests
    'no-new': 0,
  }
}
