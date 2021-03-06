const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    'background/background': path.join(__dirname, './src/background/background.ts'),
    'content/content': path.join(__dirname, './src/content/content.ts'),
    'popup/popup': path.join(__dirname, './src/popup/popup.ts'),
    'scripts/injection': path.join(__dirname, './src/scripts/injection.ts')
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
        transformPath: (targetPath) => {
          return targetPath.replace('src', '');
        }, ignore: ['*.ts']
      },
    ])
  ]
};
