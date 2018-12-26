const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    content: path.join(__dirname, './src/content/content.ts')
  },
  output: {
    path: path.join(__dirname, 'prod'),
    filename: '[name]/[name].js'
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new CleanWebpackPlugin(['prod']),
    new CopyWebpackPlugin([
      {from: './src/**/*.css', to: '[name]/[name].css', flatten: true},
      {from: './src/**/*.html', to: '[name]/[name].html', flatten: true},
      {from: './src/icons/**', to: 'icons/', flatten: true},
      {from: `./src/manifest.json`, to: 'manifest.json', flatten: true}
    ])
  ]
};
