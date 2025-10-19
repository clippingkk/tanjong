import { RouteKeys } from '../routes'
import HomePage from '../pages/home/home.page'
import ProfilePage from '../pages/profile/profile.page'
import SquarePage from '../pages/square'
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation'

const TabStack = createNativeBottomTabNavigator({
  screens: {
    [RouteKeys.TabHome]: {
      screen: HomePage,
      options: {
        title: 'Library',
        tabBarLabel: 'Books',
        // tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />
        tabBarIcon: () => ({ sfSymbol: 'book.fill' })
      }
    },
    [RouteKeys.TabSquare]: {
      screen: SquarePage,
      options: {
        title: 'Discovery',
        tabBarLabel: 'Discover',
        // tabBarIcon: ({ color, size }) => (
        //   <GlobeAmericasIcon color={color} size={size} />
        // )
        tabBarIcon: () => ({ sfSymbol: 'safari.fill' })
      }
    },
    [RouteKeys.TabProfile]: {
      screen: ProfilePage,
      options: {
        title: 'Profile',
        tabBarLabel: 'Profile',
        // tabBarIcon: ({ color, size }) => <UserIcon color={color} size={size} />
        tabBarIcon: () => ({ sfSymbol: 'person.crop.circle.fill' })
      }
    }
  }
})

export default TabStack
