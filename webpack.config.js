const path = require('path');
const webpack = require('webpack');
const config = require('exp-config');

const entry = {
  app: [path.resolve(__dirname, 'client/js/app.js')],
  styles: path.resolve(__dirname, 'client/styles/index.js')
};
const plugins = [];

if (config.useDevServer) {
  entry.app.push('webpack-hot-middleware/client?reload=true&noInfo=true');
  plugins.push(
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );
}

module.exports = {
  target: 'web',
  devtool: 'cheap-eval-source-map',
  entry,
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
    publicPath: '/'
  },

  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel'
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.styl$/,
      loader: 'style!css!stylus'
    }]
  },
  plugins,
  watchOptions: {
    aggregateTimeout: 200
  }
};
