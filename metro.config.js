const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const {
  createSentryMetroSerializer
} = require("@sentry/react-native/dist/js/tools/sentryMetroSerializer");

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    // FIXME: please fix this later!!!!
    // work around: https://github.com/kristerkari/react-native-svg-transformer/issues/317

    // please use svg-transformer and remove @react-native/metro-babel-transformer once it's fixed

    // babelTransformerPath: require.resolve('react-native-svg-transformer'),
    babelTransformerPath: require.resolve(
      '@react-native/metro-babel-transformer',
    ),
  },

  resolver: {
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },

  serializer: {
    customSerializer: createSentryMetroSerializer()
  }
};
module.exports = mergeConfig(defaultConfig, config);