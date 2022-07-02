import { config } from './webpack/configuration';
import { WebpackDevConfig } from './webpack/dev';
import { WebpackProdConfig } from './webpack/prod';

export default config.IS_DEV ? WebpackDevConfig : WebpackProdConfig;
