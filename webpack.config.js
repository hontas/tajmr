const path = require('path');
const webpack = require('webpack');
const config = require('exp-config');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pkg = require('./package.json');

const plugins = [
  new HtmlWebpackPlugin({
    title: pkg.name,
    template: 'template.jade',
    hash: true
  })
];

const entry = {
  app: [path.resolve(__dirname, 'client/js/app.jsx')],
  styles: path.resolve(__dirname, 'client/styles/index.js')
};
let publicPath = '/';

if (config.useDevServer) {
  entry.app.push('webpack-hot-middleware/client?reload=true');
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  );
}

if (process.env.GH_PAGES) {
  publicPath = '/tajmr/';
}

module.exports = {
  target: 'web',
  devtool: 'cheap-eval-source-map',
  entry,
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
    publicPath
  },

  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules)/,
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
    }, {
      test: /\.jade$/,
      loader: 'jade-loader'
    }]
  },
  plugins,
  watchOptions: {
    aggregateTimeout: 200
  }
};
