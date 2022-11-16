module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        require.resolve('babel-plugin-module-resolver'),
        {
          alias: {
            '@': './src',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  };
};
