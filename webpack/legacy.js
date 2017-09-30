const { config, getBabelOptions, merge } = require('./common.js');

module.exports = merge(config, {
  output: merge(config.output, {
    filename: '[name]-legacy.[hash].js'
  }),
  module: merge(config.module, {
    rules: config.module.rules.concat({
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: getBabelOptions(),
    })
  })
});
