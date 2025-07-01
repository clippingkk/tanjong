import React from 'react'
import { View, StyleSheet, ViewProps, useColorScheme, Platform } from 'react-native'

interface CardProps extends ViewProps {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'glass'
  padding?: number
}

export function Card({ 
  children, 
  variant = 'default',
  padding = 16,
  style,
  ...props 
}: CardProps) {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  const getCardStyle = () => {
    switch (variant) {
      case 'elevated':
        return [
          styles.card,
          styles.elevated,
          { 
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            padding
          }
        ]
      case 'glass':
        return [
          styles.card,
          styles.glass,
          { 
            backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            padding
          }
        ]
      default:
        return [
          styles.card,
          { 
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            padding
          }
        ]
    }
  }

  return (
    <View style={[getCardStyle(), style]} {...props}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  elevated: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  glass: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
})