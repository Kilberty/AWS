const path = require('path');

module.exports = {
  target: 'node',
  mode: 'production',
  optimization: {
    minimize: false,
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '.webpack'),
    filename: '[name].js', // Nome do arquivo dinâmico baseado no nome da função handler
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'), // Define `@` como caminho absoluto para `src`
    },
  },
};