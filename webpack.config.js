const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin3');
const pkg = require('./package.json');

const isProduction = process.env.NODE_ENV === 'production';
const paths = {
  entry: path.resolve(__dirname, './client/js/app.js'),
  public: path.resolve(__dirname, './public')
};

const config = {
  devtool: isProduction ? '' : 'cheap-module-source-map',

  entry: {
    app: [paths.entry]
  },

  output: {
    path: paths.public,
    filename: '[name].[hash].js',
    publicPath: isProduction ? '/tajmr/' : '/'
  },

  devServer: {
    contentBase: paths.public
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
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

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development'
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
    })
  ],

  stats: {
    children: false
  },

  watchOptions: {
    aggregateTimeout: 200
  }
};

if (isProduction) {
  config.plugins.push(
    new UglifyJSPlugin(),
    new CompressionPlugin({ test: /\.js/ })
  );
} else {
  config.entry.app.push('webpack-hot-middleware/client?reload=true');
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new BundleAnalyzerPlugin()
  );
}

module.exports = config;

