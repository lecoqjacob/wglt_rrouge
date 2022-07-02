/**
 * Default modules loader for TypeScript.
 */
export const typeScript = {
  test: /\.(ts|tsx)$/,
  loader: 'esbuild-loader',
  exclude: /node_modules/,
  options: {
    loader: 'ts',
    target: 'es2015',
  },
};

/**
 * Default modules loader for JavaScript.
 */
export const javaScript = {
  test: /\.(js|jsx)$/,
  loader: 'esbuild-loader',
  exclude: /node_modules/,
  options: {
    target: 'es2015', // Syntax to compile to (see options below for possible values)
  },
};
