import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-mdx-gfm'],
  typescript: {
    check: false,
    checkOptions: {},
    // reactDocgen: 'react-docgen-typescript',
    // reactDocgenTypescriptOptions: {
    //   shouldExtractLiteralValuesFromEnum: true,
    //   propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    // },
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
  docs: {
    autodocs: true
  },
  core: {
    disableTelemetry: true,
  },
};

export default config;
