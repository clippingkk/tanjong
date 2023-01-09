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
import ProfileRoutePage from './pages/profile/route';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useOnInit } from './hooks/init';
import { RouteKeys } from './routes';
import { BlurView } from '@react-native-community/blur';
import AuthQRCodePage from './pages/auth/qrcode.page';
import HomeRoutePage from './pages/home/route';

const RootRouteStack = createNativeStackNavigator()
const TabStack = createBottomTabNavigator()

type HomeTabPagesProps = {
}

function HomeTabPages(props: HomeTabPagesProps) {
  const c = useColorScheme()

  return (
    <TabStack.Navigator
      screenOptions={{
        headerShown: false,
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
        component={HomeRoutePage}
        options={{
          tabBarLabel: 'Feeds',
          tabBarIcon: ({ color, size }) => (
            // <MaterialCommunityIcons name="home" color={color} size={size} />
            <Text>📚</Text>
          ),
        }}
      />
      <TabStack.Screen
        name={RouteKeys.TabProfile}
        component={ProfileRoutePage}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Text>🏠</Text>
          ),
        }}
      />
    </TabStack.Navigator>
  )
}

const App = () => {
  useOnInit()
  // const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  // <SafeAreaView style={backgroundStyle}>
  //   <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
  // </SafeAreaView>
  return (
    <RootRouteStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <RootRouteStack.Screen
        name='root'
        component={HomeTabPages}
      />
      <RootRouteStack.Screen
        name={RouteKeys.AuthQRCode}
        options={{
          headerShown: true
        }}
        component={AuthQRCodePage}
      />
      {/* <RootRouteStack.Screen
        name={RouteKeys.Auth}
        component={AuthV2Page}
      /> */}
    </RootRouteStack.Navigator>
  );
};

export default App;
