/* eslint-disable @typescript-eslint/no-var-requires */

export const loadEnvVars = function () {
  let environment = process.env.NODE_ENV;
  environment = environment.toLowerCase();
  const defaultConfig = require('./default').default;
  const devConfig = require('./dev');
  const prodConfig = require('./prod');

  // process important info
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const devGuildIds = process.env.DEVELOPMENT_GUILD_IDS;
  const parsedDevGuildIds = devGuildIds.split(',');
  const mongooseConnectionUrl = process.env.MONGOOSE_CONNECTION_URL;

  // set to dev config
  devConfig.default.developmentGuildIds = parsedDevGuildIds;
  devConfig.default.botToken = botToken;
  devConfig.default.mongooseConnectionUrl = mongooseConnectionUrl;

  // set to prod config
  prodConfig.default.developmentGuildIds = parsedDevGuildIds;
  prodConfig.default.botToken = botToken;
  prodConfig.default.mongooseConnectionUrl = mongooseConnectionUrl;

  switch (environment) {
    case 'dev':
      return { ...devConfig.default, ...defaultConfig };
    case 'prod':
      return { ...prodConfig.default, ...defaultConfig };
    default:
      return { ...devConfig.default, ...defaultConfig };
  }
};

export default loadEnvVars;
