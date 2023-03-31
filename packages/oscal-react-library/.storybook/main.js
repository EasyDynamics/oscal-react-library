module.exports = {
  stories: ['../src/stories/**/*.stories.@(ts|tsx|js|jsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  typescript: {
    check: false, // do not (yet) type-check stories during Storybook build
  },
  core: {
    builder: "webpack5",
  },
};
