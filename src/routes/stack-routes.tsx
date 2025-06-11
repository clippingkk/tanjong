import {
  createNativeStackNavigator,
  NativeStackNavigationOptions
} from '@react-navigation/native-stack'
import BookPage from '../pages/book/book.page'
import DebugPage from '../pages/settings/debug.page'
import SettingsPage from '../pages/settings/settings.page'
import {RouteKeys} from '../routes'
import HomeTabPages from '../pages/home/home.page'
import AuthQRCodePage from '../pages/auth/qrcode.page.mock'
import ClippingPage from '../pages/clipping/clipping'
import AuthV3Page from '../pages/auth/auth.v3'
import AuthApplePhoneBind from '../pages/auth/phone/phone'
import AuthPhoneOTPPage from '../pages/auth/phone/otp'
import PaymentPage from '../pages/payment/payment'
import SignUpEmailPage from '../pages/signup/signup.email'
import SignUpPasswordPage from '../pages/signup/signup.password'
import SignUpOTPPage from '../pages/signup/signup.otp'
import SignUpSetNamePage from '../pages/signup/signup.set.name'
import {getRootPageOptions} from './options'
import RootTabs from './root-tabs'

export const rootStackRoutes = createNativeStackNavigator({
  initialRouteName: 'root',
  screenOptions: ps => getRootPageOptions(ps),
  screens: {
    root: {
      screen: RootTabs,
      // title: 'Home',
      // options: (ps) => getRootPageOptions(ps),
      options: {
        headerShown: false
      }
    },
    [RouteKeys.AuthQRCode]: {
      screen: AuthQRCodePage,
      options: {
        headerTransparent: true,
        headerShown: true
      }
    },
    [RouteKeys.SignUpEmail]: {
      screen: SignUpEmailPage,
      options: {
        headerTransparent: true,
        title: 'Sign Up',
        headerShown: true
      }
    },
    [RouteKeys.SignUpPassword]: {
      screen: SignUpPasswordPage,
      options: {
        headerTransparent: true,
        headerShown: true
      }
    },
    [RouteKeys.SignUpOTP]: {
      screen: SignUpOTPPage,
      options: {
        headerTransparent: true,
        headerShown: true
      }
    },
    [RouteKeys.SignUpSetName]: {
      screen: SignUpSetNamePage,
      options: {
        headerTransparent: true,
        headerShown: true
      }
    },
    [RouteKeys.AuthV3]: {
      screen: AuthV3Page,
      options: {
        headerTransparent: true,
        headerShown: true
      }
    },
    [RouteKeys.AuthAppleBind]: {
      screen: AuthApplePhoneBind,
      options: {
        headerTransparent: true,
        headerShown: true
      }
    },
    [RouteKeys.AuthPhoneOTP]: {
      screen: AuthPhoneOTPPage,
      options: {
        headerTransparent: true,
        headerShown: true
      }
    },
    [RouteKeys.BookDetail]: {
      screen: BookPage,
      options: {
        headerTransparent: true,
        headerShown: true
      }
    },
    [RouteKeys.ProfileSettings]: {
      screen: SettingsPage,
      options: {
        headerTransparent: true,
        headerTitle: 'settings',
        headerShown: true
      }
    },
    [RouteKeys.ProfileDebug]: {
      screen: DebugPage,
      options: {
        headerTransparent: true,
        headerTitle: 'Debug',
        headerShown: true
      }
    },
    [RouteKeys.Clipping]: {
      screen: ClippingPage,
      options: {
        headerTransparent: true,
        headerShown: true
      }
    },
    [RouteKeys.Payment]: {
      screen: PaymentPage,
      options: {
        headerTransparent: true,
        headerShown: true
      }
    }
  }
})

export type RootStackRoutes = typeof rootStackRoutes
