/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useRef } from 'react';
import {
  Text,
  useColorScheme,
} from 'react-native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator, NativeStackHeaderProps, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useOnInit } from './hooks/init';
import { RouteKeys, RouteParamList, TabRouteParamList } from './routes';
import { BlurView } from '@react-native-community/blur';
import AuthQRCodePage from './pages/auth/qrcode.page.mock';
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
import { RouteProp, NavigationContainer, ParamListBase, getFocusedRouteNameFromRoute, Link, NavigationContainerRef } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import PaymentPage from './pages/payment/payment';
import { routingInstrumentation } from './utils/sentry';
import SignUpEmailPage from './pages/signup/signup.email';
import SignUpPasswordPage from './pages/signup/signup.password';
import SignUpOTPPage from './pages/signup/signup.otp';
import SignUpSetNamePage from './pages/signup/signup.set.name';

const RootRouteStack = createNativeStackNavigator<RouteParamList>()
const TabStack = createBottomTabNavigator<TabRouteParamList>()

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

function getRootPageOptions(props: {
  route: RouteProp<ParamListBase, "root">;
  navigation: any;
}): NativeStackNavigationOptions {
  let headerTitle = ''
  let headerRight: NativeStackHeaderProps['options']['headerRight'] = undefined;
  const { t } = useTranslation()

  const routeName = (getFocusedRouteNameFromRoute(props.route) as RouteKeys) ?? RouteKeys.TabHome;
  switch (routeName) {
    case RouteKeys.TabHome:
      headerTitle = t('app.home.title')
      // headerRight = () => (
      //   <Link to={{ screen: RouteKeys.Payment }}>
      //     🤑
      //   </Link>
      // )
      break
    case RouteKeys.TabProfile:
      headerTitle = 'Me'
      headerRight = () => (
        <Link to={{ screen: RouteKeys.ProfileSettings }}>
          ⚙️
        </Link>
      )
      break
    default:
      headerTitle = 'ClippingKK'
  }

  return {
    headerTitle,
    headerRight,
  }
}

const App = () => {
  useOnInit()
  const c = useColorScheme()
  const textColor = useTextColor()
  const { t } = useTranslation()
  const navigation = useRef<NavigationContainerRef<RouteParamList>>(null)
  return (
    <NavigationContainer
      ref={navigation}
      onReady={() => {
        // Register the navigation container with the instrumentation
        routingInstrumentation.registerNavigationContainer(navigation);
      }}
    >
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
          options={ps => getRootPageOptions({ ...ps })}
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
          name={RouteKeys.SignUpEmail}
          options={{
            headerTransparent: true,
            title: 'Sign Up',
            headerShown: true
          }}
          component={SignUpEmailPage}
        />
        <RootRouteStack.Screen
          name={RouteKeys.SignUpPassword}
          options={{
            headerTransparent: true,
            headerShown: true
          }}
          component={SignUpPasswordPage}
        />
        <RootRouteStack.Screen
          name={RouteKeys.SignUpOTP}
          options={{
            headerTransparent: true,
            headerShown: true
          }}
          component={SignUpOTPPage}
        />
        <RootRouteStack.Screen
          name={RouteKeys.SignUpSetName}
          options={{
            headerTransparent: true,
            headerShown: true
          }}
          component={SignUpSetNamePage}
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
            headerTitle: t('app.menu.settings') ?? 'settings',
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
        <RootRouteStack.Screen
          name={RouteKeys.Payment}
          options={{
            headerTransparent: true,
            headerShown: true
          }}
          component={PaymentPage}
        />
      </RootRouteStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
