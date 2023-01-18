import React from 'react'
import { View, Text, useColorScheme } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RouteKeys } from '../../routes'
import HomePage from './home.page'
import ClippingPage from '../clipping/clipping'
import BookPage from '../book/book.page'
import { useColorModeValue } from 'native-base'
import { useTextColor } from '../../hooks/color'

type HomeRoutePageProps = {
}

const HomeStack = createNativeStackNavigator()

function HomeRoutePage(props: HomeRoutePageProps) {
  const c = useColorScheme()
  const textColor = useTextColor()
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerBlurEffect: c === 'dark' ? 'dark' : 'light',
        headerTitleStyle: {
          color: textColor
        }
      }}
    >
      <HomeStack.Screen
        name={RouteKeys.Book}
        options={({ route }: any) => ({
          headerTitle: 'Books',
        })}
        component={HomePage}
      />
      <HomeStack.Screen
        name={RouteKeys.BookDetail}
        component={BookPage}
      />
      <HomeStack.Screen
        name={RouteKeys.Clipping}
        component={ClippingPage}
      />
    </HomeStack.Navigator>
  )
}

export default HomeRoutePage