'use strict';

module.exports = {
  semi: true,
  singleQuote: true,
  useTabs: false,
  quoteProps: 'consistent',
  bracketSpacing: true,
  arrowParens: 'always',
  printWidth: 120,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: ['^node:(.*)$', '<THIRD_PARTY_MODULES>', '^[./]'],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrderGroupNamespaceSpecifiers: true,
  importOrderCaseInsensitive: true,
  importOrderParserPlugins: ['typescript', '["decorators", { "decoratorsBeforeExport": true }]'],
};
