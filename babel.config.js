module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@hooks': './src/hooks',
            '@services': './src/services',
            '@utils': './src/utils',
            '@assets': './src/assets',
            '@theme': './src/theme',
            '@types': './src/types',
            '@store': './src/store',
            '@navigation': './src/navigation',
          },
        },
      ],
    ],
  };
};
