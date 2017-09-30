const { config, getBabelOptions, merge } = require('./common.js');

module.exports = merge(config, {
  module: merge(config.module, {
    rules: config.module.rules.concat({
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: getBabelOptions([
        'Chrome > 60',
        'Safari > 10.1',
        'iOS > 10.3'
      ])
    })
  })
});
