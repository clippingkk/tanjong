global.__reanimatedWorkletInit = () => {}
import 'react-native-gesture-handler/jestSetup';
import "@shopify/flash-list/jestSetup";

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
jest.mock('react-native-file-access', () => require('./react-native-file-access'))
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

