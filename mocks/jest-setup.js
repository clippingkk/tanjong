import '@testing-library/react-native/extend-expect';

global.__reanimatedWorkletInit = () => { }
import mockRNCameraRoll from '@react-native-camera-roll/camera-roll/src/__mocks__/nativeInterface'
import 'react-native-gesture-handler/jestSetup';
import "@shopify/flash-list/jestSetup";
// import rnvs from './react-native-view-shot'

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
jest.mock('react-native-file-access', () => require('./react-native-file-access'))
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => { };
  return Reanimated;
});

jest.mock('@react-native-camera-roll/camera-roll', () => mockRNCameraRoll)
jest.mock('react-native-webview', () => {
  const { View } = require('react-native');
  return View
});
jest.mock('react-native-view-shot', () => {
  const { View } = require('react-native');
  return () => <View />;
});
jest.mock('react-native-linear-gradient', () => {
  const { View } = require('react-native');
  return View
});
jest.mock('@sentry/react-native', () => {
  return {
    __esModule: true,
    init: jest.fn(),
  }
})
jest.mock('react-native-bootsplash', () => {
  return {
    hide: jest.fn(),
  }
})
jest.mock('@leancloud/platform-adapters-react-native', () => {
  return {}
})
// jest.mock('@react-native-community/push-notification-ios', () => {
//   const { View } = require('react-native');
//   return View
// })
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

