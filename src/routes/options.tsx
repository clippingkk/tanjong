import {
  RouteProp,
  Link,
  ParamListBase,
  getFocusedRouteNameFromRoute
} from '@react-navigation/native'
import {
  NativeStackNavigationOptions,
  NativeStackHeaderProps,
  NativeStackNavigationProp
} from '@react-navigation/native-stack'
import {RouteKeys} from '../routes'

export function getRootPageOptions(props: {
  route: RouteProp<ParamListBase, string>
  navigation: NativeStackNavigationProp<ParamListBase, string, undefined>
  theme: ReactNavigation.Theme
}): NativeStackNavigationOptions {
  let headerTitle = ''
  let headerRight: NativeStackHeaderProps['options']['headerRight'] = undefined
  const isRoot = props.route.name === 'root'
  if (!isRoot) {
    return {}
  }

  const routeName =
    (getFocusedRouteNameFromRoute(props.route) as RouteKeys) ??
    RouteKeys.TabHome
  switch (routeName) {
    case RouteKeys.TabHome:
      headerTitle = 'Home'
      // headerRight = () => (
      //   <Link to={{ screen: RouteKeys.Payment }}>
      //     🤑
      //   </Link>
      // )
      break
    case RouteKeys.TabSquare:
      headerTitle = 'Square'
      break
    case RouteKeys.TabProfile:
      headerTitle = 'Me'
      headerRight = () => <Link screen={RouteKeys.ProfileSettings}>⚙️</Link>
      break
    default:
      headerTitle = 'ClippingKK'
  }

  return {
    headerTitle,
    headerRight
  }
}
