const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.tsx',
  mode: 'production',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
            loader: 'esbuild-loader',
            options: {
              loader: 'tsx', // Specify 'jsx' loader for JSX files
              target: 'es2015', // Set your target environment
            },
        },
      },
      // Add other rules for styles, images, etc.
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html', // Path to your HTML template
      filename: 'index.html', // Output HTML filename
    }),
  ],
  devServer: {
    hot: true,
  },
};
