/* eslint-disable @typescript-eslint/no-var-requires */
// import * as devConfig from './dev';
// import * as prodConfig from './prod';

export const loadEnvVars = function () {
  let environment = process.env.NODE_ENV;
  environment = environment.toLowerCase();
  const devConfig = require('./dev');
  const prodConfig = require('./prod');

  // process important info
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const devGuildIds = process.env.DEVELOPMENT_GUILD_IDS;
  const parsedDevGuildIds = devGuildIds.split(',');

  // set to dev config
  devConfig.default.developmentGuildIds = parsedDevGuildIds;
  devConfig.default.botToken = botToken;

  // set to prod config
  prodConfig.default.developmentGuildIds = parsedDevGuildIds;
  prodConfig.default.botToken = botToken;

  switch (environment) {
    case 'dev':
      return devConfig.default;
    case 'prod':
      return prodConfig.default;
    default:
      return devConfig.default;
  }
};

export default loadEnvVars;
