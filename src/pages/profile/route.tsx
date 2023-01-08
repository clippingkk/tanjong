import React from 'react'
import { View, Text, useColorScheme } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RouteKeys } from '../../routes'
import ClippingPage from '../clipping/clipping'
import ProfilePage from './profile.page'

type ProfileRoutePageProps = {
}

const ProfileStack = createNativeStackNavigator()

function ProfileRoutePage(props: ProfileRoutePageProps) {
  const c = useColorScheme()
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerBlurEffect: c === 'dark' ? 'dark' : 'light',
      }}
    >
      <ProfileStack.Screen
        name={RouteKeys.TabHome}
        options={({ route }: any) => ({
          headerTitle: 'Books',
        })}
        component={ProfilePage}
      />
      <ProfileStack.Screen
        name={RouteKeys.ProfileClipping}
        component={ClippingPage}
      />
    </ProfileStack.Navigator>
  )
}

export default ProfileRoutePage