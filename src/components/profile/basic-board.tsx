import React, {useMemo} from 'react'
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  Image,
  SafeAreaView
} from 'react-native'
import {CachedImage} from '@georstat/react-native-image-cache'
import {BlurView} from '@react-native-community/blur'
import {useHeaderHeight} from '@react-navigation/elements'
import {User} from '../../schema/generated'
import {getValidImageUrl} from '../../utils/image'
import PremiumBadge from './premium-badge'
import {FontLXGW} from '../../styles/font'

const lightColors = {
  card: 'rgba(255, 255, 255, 0.6)',
  text: '#333',
  bio: '#666',
  shadow: '#000'
}

const darkColors = {
  card: 'rgba(0, 0, 0, 0.4)',
  text: '#fff',
  bio: '#ccc',
  shadow: '#fff'
}

type BasicBoardProps = {
  profile?: Pick<User, 'id' | 'name' | 'avatar' | 'bio' | 'premiumEndAt'>
}

function BasicBoard(props: BasicBoardProps) {
  const isDarkMode = useColorScheme() === 'dark'
  const colors = isDarkMode ? darkColors : lightColors
  const avatar = getValidImageUrl(props.profile?.avatar)
  const hh = useHeaderHeight()
  const {width} = useWindowDimensions()

  const isPremium = useMemo(() => {
    const premiumEndAt = props.profile?.premiumEndAt
    if (!premiumEndAt) {
      return false
    }
    return new Date(premiumEndAt) > new Date()
  }, [props.profile?.premiumEndAt])

  if (!props.profile) {
    return null
  }

  return (
    <View style={styles.container}>
      <BlurView
        style={styles.blurView}
        blurType={isDarkMode ? 'dark' : 'light'}
        blurAmount={10}
        reducedTransparencyFallbackColor={isDarkMode ? 'black' : 'white'}>
        <CachedImage
          source={avatar!}
          style={{width: '100%', height: '100%'}}
          resizeMode="cover"
        />
      </BlurView>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            shadowColor: colors.shadow,
            width: width - 32 * 3
          }
        ]}>
        <View style={styles.cardContent}>
          <CachedImage
            source={avatar!}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={styles.infoContainer}>
            <View style={styles.nameContainer}>
              <Text style={[styles.name, {color: colors.text}]}>
                {props.profile.name}
              </Text>
              {isPremium && <PremiumBadge style={styles.badge} />}
            </View>
            <Text style={[styles.bio, {color: colors.bio}]} numberOfLines={2}>
              {props.profile.bio}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16 + 44,
    paddingBottom: 8
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 4
  },
  card: {
    borderRadius: 16,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
    marginHorizontal: 16
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    width: '100%'
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  name: {
    fontSize: 20,
    fontFamily: FontLXGW,
    fontWeight: 'bold'
  },
  badge: {
    marginLeft: 8
  },
  bio: {
    fontSize: 14,
    fontFamily: FontLXGW
  }
})

export default BasicBoard
