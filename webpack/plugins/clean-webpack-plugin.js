// Import dependencies.
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

/**
 * CleanWebpackPlugin()
 * A webpack plugin to remove/clean your build folder(s) before building.
 */
export const cleanWebpackPlugin = new CleanWebpackPlugin({
  verbose: true,
});
