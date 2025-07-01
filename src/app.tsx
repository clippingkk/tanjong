/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useRef } from 'react'
import { Text, useColorScheme } from 'react-native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useOnInit } from './hooks/init'
import { RouteKeys, RouteParamList, TabRouteParamList } from './routes'
import { BlurView } from '@react-native-community/blur'
import { useTextColor } from './hooks/color'
import HomePage from './pages/home/home.page'
import ProfilePage from './pages/profile/profile.page'
import {
  NavigationContainer,
  NavigationContainerRef,
  createStaticNavigation,
} from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { routingInstrumentation } from './utils/sentry'
import { rootStackRoutes } from './routes/stack-routes'
import './global.css'

const Navigation = createStaticNavigation(rootStackRoutes)

const App = () => {
  const c = useColorScheme()
  const textColor = useTextColor()
  const { t } = useTranslation()
  const navigation = useRef<NavigationContainerRef<RouteParamList>>(null)
  useOnInit(navigation.current)
  return (
    <>
      {/* <NavigationContainer
        ref={navigation}
        onReady={() => {
          // Register the navigation container with the instrumentation
          routingInstrumentation.registerNavigationContainer(navigation);
        }}
      > */}
      <Navigation ref={navigation} />
      {/* <RootRouteStack.Navigator
          screenOptions={{
            headerTransparent: true,
            headerShown: true,
            headerBlurEffect: c === 'dark' ? 'dark' : 'light',
            headerTitleStyle: {
              color: textColor
            },
          }}
        /> */}
      {/* </NavigationContainer> */}
    </>
  )
}

export default App
