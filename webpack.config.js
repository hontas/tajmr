'use strict';

const path = require('path');
const webpack = require('webpack');
const config = require('exp-config');

const plugins = [];
const entry = {
  app: [path.resolve(__dirname, 'client/js/app.js')],
  styles: path.resolve(__dirname, 'client/styles/index.js')
};

if (config.useDevServer) {
  entry.app.push('webpack-hot-middleware/client?reload=true');
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
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
      loader: 'babel-loader'
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.styl$/,
      loader: 'style-loader!css-loader!stylus-loader'
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }]
  },
  plugins,
  watchOptions: {
    aggregateTimeout: 200
  }
};
