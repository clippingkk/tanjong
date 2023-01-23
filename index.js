/**
 * @format
 */

import 'react-native-reanimated'
import {AppRegistry} from 'react-native'
// import App from './App';
import {name as appName} from './app.json'
import Root from './src/root'

import * as Sentry from '@sentry/react-native'

Sentry.init({ 
  dsn: 'https://66694f1246e14ccabddd23e7f5b8c337@o108564.ingest.sentry.io/5499143', 
})

AppRegistry.registerComponent(appName, () => Sentry.wrap(Root))
