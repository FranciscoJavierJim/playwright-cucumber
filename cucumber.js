const common = {
  paths: ['src/features/**/*.feature'],
  requireModule: ['ts-node/register'],
  require: ['src/support/**/*.ts', 'src/steps/**/*.ts'],
  format: ['progress-bar', 'summary', 'json:reports/cucumber-report.json'],
  formatOptions: {
    snippetInterface: 'async-await',
  },
};

module.exports = {
  default: {
    ...common,
  },
  smoke: {
    ...common,
    tags: '@smoke and not @ignore',
  },
  regression: {
    ...common,
    tags: '@regression and not @ignore',
  },
  dry: {
    ...common,
    dryRun: true,
  },
};
