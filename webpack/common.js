const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin3');
const pkg = require('../package.json');

const isProduction = process.env.NODE_ENV === 'production';

const entry = {
  app: [path.resolve(__dirname, '../client/js/app.js')]
};
const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'dev')
  }),
  new HtmlWebpackPlugin({
    title: pkg.name,
    template: 'template.jade',
    inject: 'head', // needed for StyleExtHtmlWebpackPlugin
    minimize: false
  }),
  new ExtractTextPlugin('styles.css'),
  new StyleExtHtmlWebpackPlugin(), // internalize styles
  new ScriptExtHtmlWebpackPlugin({
    defaultAttribute: 'async'
  }),
  new CaseSensitivePathsPlugin(),
  new WatchMissingNodeModulesPlugin(path.resolve('node_modules')),
];

if (isProduction) {
  plugins.push(new UglifyJSPlugin());
} else {
  entry.app.push('webpack-hot-middleware/client?reload=true');
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new BundleAnalyzerPlugin()
  );
}

module.exports.config = {
  devtool: !isProduction ? 'cheap-module-source-map' : '',

  entry,

  output: {
    path: path.resolve(__dirname, '../public'),
    filename: '[name].[hash].js',
    publicPath: isProduction ? '/tajmr/' : '/'
  },

  devServer: {
    contentBase: path.resolve(__dirname, '../public')
  },

  module: {
    rules: [
      {
        test: /\.styl$/,
        include: /critical/,
        use: ExtractTextPlugin.extract({
          use: [
            { loader: 'css-loader' },
            { loader: 'stylus-loader' }
          ]
        })
      },
      {
        test: /\.styl$/,
        exclude: /critical/,
        loader: 'style-loader!css-loader!stylus-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.jade$/,
        loader: 'jade-loader'
      }
    ]
  },

  plugins,

  stats: {
    children: false
  },

  watchOptions: {
    aggregateTimeout: 200
  }
};

module.exports.getBabelOptions = (browsers = ['> 1%', 'last 2 versions']) => ({
  babelrc: false,
  presets: [
    ['env', {
      modules: false,
      useBuiltIns: true,
      targets: { browsers }
    }],
    'react'
  ],
  plugins: [
    'transform-class-properties',
    'transform-object-rest-spread'
  ]
});

module.exports.merge = (...args) => Object.assign.apply(Object, [{}, ...args]);
