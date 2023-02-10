/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, type PropsWithChildren } from 'react';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useOnInit } from './hooks/init';
import { RouteKeys } from './routes';
import { BlurView } from '@react-native-community/blur';
import AuthQRCodePage from './pages/auth/qrcode.page';
import ClippingPage from './pages/clipping/clipping';
import { useTextColor } from './hooks/color';
import AuthV3Page from './pages/auth/auth.v3';
import AuthApplePhoneBind from './pages/auth/phone/phone';
import AuthPhoneOTPPage from './pages/auth/phone/otp';
import HomePage from './pages/home/home.page';
import BookPage from './pages/book/book.page';
import DebugPage from './pages/settings/debug.page';
import SettingsPage from './pages/settings/settings.page';
import ProfilePage from './pages/profile/profile.page';
import { RouteProp, ParamListBase, getFocusedRouteNameFromRoute } from '@react-navigation/native';

const RootRouteStack = createNativeStackNavigator()
const TabStack = createBottomTabNavigator()

type HomeTabPagesProps = {
}

function HomeTabPages(props: HomeTabPagesProps) {
  const c = useColorScheme()
  const textColor = useTextColor()

  return (
    <TabStack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerShown: true,
        headerTitleStyle: {
          color: c === 'dark' ? '#ffffff' : '#000000'
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarBackground: () => (
          <BlurView
            blurType={c === 'dark' ? 'dark' : 'light'}
            blurAmount={10}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              top: 0
            }}
          />
        ),
      }}
      backBehavior='history'
    >
      <TabStack.Screen
        name={RouteKeys.TabHome}
        component={HomePage}
        options={{
          title: 'Books',
          headerTitle: 'Books',
          tabBarLabel: 'Books',
          tabBarIcon: ({ color, size }) => (
            <Text>📚</Text>
          ),
        }}
      />
      <TabStack.Screen
        name={RouteKeys.TabProfile}
        component={ProfilePage}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Text>🏠</Text>
          ),
        }}
      />
    </TabStack.Navigator>
  )
}

function getRootPageTitle(route: RouteProp<ParamListBase, "root">) {
  const routeName = (getFocusedRouteNameFromRoute(route) as RouteKeys) ?? RouteKeys.TabHome;
  switch (routeName) {
    case RouteKeys.TabHome:
      return 'Books'
    case RouteKeys.TabProfile:
      return 'Me'
  }
  return 'ClippingKK'
}

const App = () => {
  useOnInit()
  const c = useColorScheme()
  const textColor = useTextColor()
  return (
    <RootRouteStack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerShown: true,
        headerBlurEffect: c === 'dark' ? 'dark' : 'light',
        headerTitleStyle: {
          color: textColor
        },
      }}
    >
      <RootRouteStack.Screen
        name='root'
        options={(ps) => ({
          headerTitle: getRootPageTitle(ps.route)
        })}
        component={HomeTabPages}
      />
      <RootRouteStack.Screen
        name={RouteKeys.AuthQRCode}
        options={{
          headerTransparent: true,
          headerShown: true
        }}
        component={AuthQRCodePage}
      />
      <RootRouteStack.Screen
        name={RouteKeys.AuthV3}
        options={{
          headerTransparent: true,
          headerShown: true
        }}
        component={AuthV3Page}
      />
      <RootRouteStack.Screen
        name={RouteKeys.AuthAppleBind}
        options={{
          headerTransparent: true,
          headerShown: true
        }}
        component={AuthApplePhoneBind}
      />
      <RootRouteStack.Screen
        name={RouteKeys.AuthPhoneOTP}
        options={{
          headerTransparent: true,
          headerShown: true
        }}
        component={AuthPhoneOTPPage}
      />
      <RootRouteStack.Screen
        name={RouteKeys.BookDetail}
        options={{
          headerTransparent: true,
          headerShown: true
        }}
        component={BookPage}
      />
      <RootRouteStack.Screen
        name={RouteKeys.ProfileSettings}
        options={{
          headerTransparent: true,
          headerTitle: 'Settings',
          headerShown: true
        }}
        component={SettingsPage}
      />
      <RootRouteStack.Screen
        name={RouteKeys.ProfileDebug}
        options={{
          headerTransparent: true,
          headerTitle: 'Debug',
          headerShown: true
        }}
        component={DebugPage}
      />
      <RootRouteStack.Screen
        name={RouteKeys.Clipping}
        options={{
          headerTransparent: true,
          headerShown: true
        }}
        component={ClippingPage}
      />
    </RootRouteStack.Navigator>
  );
};

export default App;
