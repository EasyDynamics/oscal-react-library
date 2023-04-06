// eslint-disable-next-line import/no-extraneous-dependencies
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");

module.exports = {
  webpack: {
    configure(config) {
      const newConfig = config;
      const plugins = config.resolve.plugins.filter(
        (plugin) => !(plugin instanceof ModuleScopePlugin)
      );
      newConfig.resolve.plugins = plugins;
      return newConfig;
    },
  },
};
