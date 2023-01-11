import React from 'react'
import { View, Text, useColorScheme } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RouteKeys } from '../../routes'
import ClippingPage from '../clipping/clipping'
import ProfilePage from './profile.page'
import SettingsPage from '../settings/settings.page'
import DebugPage from '../settings/debug.page'

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
        name={RouteKeys.Profile}
        options={({ route }: any) => ({
          headerTitle: 'Profile',
        })}
        component={ProfilePage}
      />
      <ProfileStack.Screen
        name={RouteKeys.ProfileSettings}
        options={{
          headerTitle: 'Settings'
        }}
        component={SettingsPage}
      />
      <ProfileStack.Screen
        name={RouteKeys.ProfileDebug}
        options={{
          headerTitle: 'Debug'
        }}
        component={DebugPage}
      />
    </ProfileStack.Navigator>
  )
}

export default ProfileRoutePage