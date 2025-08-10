import React from 'react'
import { StyleSheet, useColorScheme, ViewProps } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { BlurView } from '@react-native-community/blur'

interface GradientBackgroundProps extends ViewProps {
  children: React.ReactNode
  colors?: {
    light: string[]
    dark: string[]
  }
  blur?: boolean
  blurAmount?: number
}

const defaultColors = {
  light: ['#F8FAFC', '#EDE9FE'], // Light gradient with purple tint
  dark: ['#0F172A', '#1E1B4B'] // Dark gradient with purple tint
}

export function GradientBackground({
  children,
  colors = defaultColors,
  blur = false,
  blurAmount = 10,
  style,
  ...props
}: GradientBackgroundProps) {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const gradientColors = isDark ? colors.dark : colors.light

  return (
    <LinearGradient
      colors={gradientColors}
      style={[styles.container, style]}
      {...props}
    >
      {blur && (
        <BlurView
          style={styles.blurView}
          blurType={isDark ? 'dark' : 'light'}
          blurAmount={blurAmount}
        />
      )}
      {children}
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})