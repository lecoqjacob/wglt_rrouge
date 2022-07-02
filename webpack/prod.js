// Import dependencies.
import { ESBuildMinifyPlugin } from 'esbuild-loader';
import { merge } from 'webpack-merge';

// Import Configuration.
import { WebpackCommonConfig } from './common';
import {
  cleanWebpackPlugin,
  miniCssExtractPlugin,
  imageMinimizerWebpackPlugin,
} from './plugins';

/**
 * Plugins for production build.
 */
const plugins = [cleanWebpackPlugin, miniCssExtractPlugin];

/**
 * Webpack production configuration.
 */
const WebpackConfig = {
  plugins,
  optimization: {
    minimize: true,
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'es2015',
        css: true, // Apply minification to CSS assets
      }),
      // new CssMinimizerPlugin(),
      // new TerserPlugin(),
      imageMinimizerWebpackPlugin,
    ],
  },
};

// Export configuration.
export const WebpackProdConfig = merge(WebpackCommonConfig, WebpackConfig);
