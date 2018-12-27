const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    'content/content': path.join(__dirname, './src/content/content.ts')
  },
  output: {
    path: path.join(__dirname, 'prod'),
    filename: '[name].js'
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
      {
        from: './src', to: './',
        transformPath: function (targetPath) {
          return targetPath.replace('src', '');
        }, ignore: ['*.ts']
      },
    ])
  ]
};
