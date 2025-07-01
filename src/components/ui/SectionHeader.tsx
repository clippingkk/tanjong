import React from 'react'
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native'
import { FontLXGW } from '../../styles/font'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: {
    label: string
    onPress: () => void
  }
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={[
          styles.title,
          { color: isDark ? '#F1F5F9' : '#0F172A', fontFamily: FontLXGW }
        ]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[
            styles.subtitle,
            { color: isDark ? '#94A3B8' : '#64748B', fontFamily: FontLXGW }
          ]}>
            {subtitle}
          </Text>
        )}
      </View>
      {action && (
        <TouchableOpacity onPress={action.onPress} style={styles.actionButton}>
          <Text style={[
            styles.actionText,
            { color: '#3B82F6', fontFamily: FontLXGW }
          ]}>
            {action.label}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
})