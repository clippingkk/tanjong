/**
 * @format
 */

import 'react-native-reanimated'
import { AppRegistry } from 'react-native'
// import App from './App';
import { name as appName } from './app.json'
import Root from './src/root'

import * as Sentry from '@sentry/react-native'
import { routingInstrumentation } from './src/utils/sentry'

Sentry.init({
  dsn: "https://f06399ea901af86bbc522bf5ba514033@o108564.ingest.sentry.io/4506340814749696",
  debug: true,
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation
    })
  ]
})

AppRegistry.registerComponent(appName, () => Sentry.wrap(Root))
