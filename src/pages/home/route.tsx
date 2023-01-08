import React from 'react'
import { View, Text, useColorScheme } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RouteKeys } from '../../routes'
import HomePage from './home.page'
import ClippingPage from '../clipping/clipping'

type HomeRoutePageProps = {
}

const HomeStack = createNativeStackNavigator()

function HomeRoutePage(props: HomeRoutePageProps) {
  const c = useColorScheme()
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerBlurEffect: c === 'dark' ? 'dark' : 'light',
      }}
    >
      <HomeStack.Screen
        name={RouteKeys.TabHome}
        options={({ route }: any) => ({
          headerTitle: 'Books',
        })}
        component={HomePage}
      />
      <HomeStack.Screen
        name={RouteKeys.HomeClipping}
        component={ClippingPage}
      />
    </HomeStack.Navigator>
  )
}

export default HomeRoutePage