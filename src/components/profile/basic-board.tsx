import React, { useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  useWindowDimensions
} from 'react-native'
import { CachedImage } from '@georstat/react-native-image-cache'
import LinearGradient from 'react-native-linear-gradient'
import { User } from '../../schema/generated'
import { getValidImageUrl } from '../../utils/image'
import PremiumBadge from './premium-badge'
import { FontLXGW } from '../../styles/font'

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num.toString()
}

const lightColors = {
  card: 'rgba(255, 255, 255, 0.95)',
  gradientStart: '#818CF8',
  gradientEnd: '#C084FC',
  text: '#1E293B',
  bio: '#64748B',
  statsText: '#475569',
  statsBg: 'rgba(99, 102, 241, 0.08)',
  shadow: '#6366F1',
  divider: 'rgba(99, 102, 241, 0.1)'
}

const darkColors = {
  card: 'rgba(30, 41, 59, 0.95)',
  gradientStart: '#6366F1',
  gradientEnd: '#8B5CF6',
  text: '#E0E7FF',
  bio: '#94A3B8',
  statsText: '#CBD5E1',
  statsBg: 'rgba(99, 102, 241, 0.15)',
  shadow: '#6366F1',
  divider: 'rgba(99, 102, 241, 0.2)'
}

type BasicBoardProps = {
  profile?: Pick<User, 'id' | 'name' | 'avatar' | 'bio' | 'premiumEndAt'>
  stats?: {
    books?: number
    clippings?: number
    recent?: number
  }
}

function BasicBoard(props: BasicBoardProps) {
  const isDarkMode = useColorScheme() === 'dark'
  const colors = isDarkMode ? darkColors : lightColors
  const avatar = getValidImageUrl(props.profile?.avatar)
  const { width } = useWindowDimensions()

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
      {/* Profile Card */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            shadowColor: colors.shadow
          }
        ]}>
        {/* Gradient Header */}
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientHeader}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <CachedImage
                source={avatar!}
                style={styles.avatar}
                resizeMode="cover"
              />
              {isPremium && (
                <View style={styles.premiumBadgeContainer}>
                  <Text style={styles.premiumEmoji}>👑</Text>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <Text style={[styles.name, { color: colors.text }]}>
            {props.profile.name}
          </Text>
          {props.profile.bio && (
            <Text style={[styles.bio, { color: colors.bio }]} numberOfLines={2}>
              {props.profile.bio}
            </Text>
          )}

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={[styles.statItem, { backgroundColor: colors.statsBg }]}>
              <Text style={[styles.statValue, { color: colors.text }]}>{props.stats?.books || 0}</Text>
              <Text style={[styles.statLabel, { color: colors.statsText }]}>Books</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: colors.statsBg }]}>
              <Text style={[styles.statValue, { color: colors.text }]}>{formatNumber(props.stats?.clippings || 0)}</Text>
              <Text style={[styles.statLabel, { color: colors.statsText }]}>Clippings</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: colors.statsBg }]}>
              <Text style={[styles.statValue, { color: colors.text }]}>{props.stats?.recent || 0}</Text>
              <Text style={[styles.statLabel, { color: colors.statsText }]}>Last 3 Months</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8
  },
  card: {
    borderRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden'
  },
  gradientHeader: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  avatarContainer: {
    position: 'absolute',
    alignItems: 'center',
    // overflow: 'hidden',
    // transform: [{ translateY: 40 }]
  },
  avatarWrapper: {
    // position: 'relative'
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden'
  },
  premiumBadgeContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFD700',
    width: 21,
    height: 21,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.9)'
  },
  premiumEmoji: {
    fontSize: 16
  },
  profileInfo: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center'
  },
  name: {
    fontSize: 24,
    fontFamily: FontLXGW,
    fontWeight: '500',
    letterSpacing: -0.5,
    marginBottom: 8
  },
  bio: {
    fontSize: 14,
    fontFamily: FontLXGW,
    fontWeight: '300',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    opacity: 0.8
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 8
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 6,
    borderRadius: 12
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: FontLXGW,
    marginBottom: 4
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '400',
    fontFamily: FontLXGW,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.7
  }
})

export default BasicBoard
