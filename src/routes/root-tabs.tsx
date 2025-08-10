import {RouteKeys, RouteParamList, TabRouteParamList} from '../routes'
import {BlurView} from '@react-native-community/blur'
import {useTextColor} from '../hooks/color'
import HomePage from '../pages/home/home.page'
import ProfilePage from '../pages/profile/profile.page'
import SquarePage from '../pages/square'
import {
  HomeIcon,
  UserIcon,
  GlobeAmericasIcon
} from 'react-native-heroicons/outline'
import {useColorScheme} from 'react-native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {createStaticNavigation} from '@react-navigation/native'

const TabStack = createBottomTabNavigator({
  screenOptions: props => {
    const c = useColorScheme()
    const textColor = useTextColor()
    return {
      headerTransparent: true,
      headerShown: true,
      headerTitleStyle: {
        color: c === 'dark' ? '#E0E7FF' : '#1E293B',
        fontSize: 18,
        fontWeight: '400',
        letterSpacing: -0.3
      },
      headerBackground: () => (
        <BlurView
          blurType={c === 'dark' ? 'dark' : 'light'}
          blurAmount={25}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: c === 'dark' ? 'rgba(15,23,42,0.4)' : 'rgba(248,250,252,0.7)'
          }}
        />
      ),
      headerShadowVisible: false,
      headerLargeTitleStyle: {
        color: c === 'dark' ? '#ffffff' : '#000000'
      },
      tabBarStyle: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
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
      )
    }
  },
  screens: {
    [RouteKeys.TabHome]: {
      screen: HomePage,
      options: {
        title: 'Library',
        tabBarLabel: 'Books',
        tabBarIcon: ({color, size}) => <HomeIcon color={color} size={size} />
      }
    },
    [RouteKeys.TabSquare]: {
      screen: SquarePage,
      options: {
        title: 'Discovery',
        tabBarLabel: 'Discover',
        tabBarIcon: ({color, size}) => (
          <GlobeAmericasIcon color={color} size={size} />
        )
      }
    },
    [RouteKeys.TabProfile]: {
      screen: ProfilePage,
      options: {
        title: 'Profile',
        tabBarLabel: 'Profile',
        tabBarIcon: ({color, size}) => <UserIcon color={color} size={size} />
      }
    }
  }
})

// type HomeTabPagesProps = {
// }

// const Navigation = createStaticNavigation(TabStack)

// function RootTabs(props: HomeTabPagesProps) {
//   return <Navigation />
// }

export default TabStack
