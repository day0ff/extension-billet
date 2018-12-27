const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    'content/content': path.join(__dirname, './src/content/content.ts'),
    'background/background': path.join(__dirname, './src/background/background.ts')
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
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
      {
        from: './src', to: './',
        transformPath: (targetPath) => {
          return targetPath.replace('src', '');
        }, ignore: ['*.ts']
      },
    ])
  ]
};