const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    content: path.join(__dirname, './src/content/content.ts')
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name]/[name].js'
  },
  module: {
    rules: [{
        test: /\.ts$/,
        enforce: 'pre',
        use: 'tslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new CleanWebpackPlugin(['build']),
    new CopyWebpackPlugin([
      {from: './src/**/*.css', to: '[name]/[name].css', flatten: true},
      {from: './src/**/*.html', to: '[name]/[name].html', flatten: true},
      {from: './src/icons/**', to: 'icons/', flatten: true},
      {from: './src/manifest.json', to: 'manifest.json', flatten: true}
    ])
  ]
};
