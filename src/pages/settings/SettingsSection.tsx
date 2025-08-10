import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

type SettingsSectionProps = {
  title?: string;
  icon?: string;
  children: React.ReactNode;
};

const lightColors = {
  background: 'rgba(255, 255, 255, 0.95)',
  title: '#64748B',
  shadow: '#6366F1',
  iconBg: 'rgba(99, 102, 241, 0.1)',
};

const darkColors = {
  background: 'rgba(30, 41, 59, 0.95)',
  title: '#94A3B8',
  shadow: '#6366F1',
  iconBg: 'rgba(99, 102, 241, 0.2)',
};

const SettingsSection = ({ title, icon, children }: SettingsSectionProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.titleContainer}>
          {icon && (
            <View style={[styles.iconContainer, { backgroundColor: colors.iconBg }]}>
              <Text style={styles.icon}>{icon}</Text>
            </View>
          )}
          <Text style={[styles.title, { color: colors.title }]}>{title}</Text>
        </View>
      )}
      <View style={[styles.content, { backgroundColor: colors.background, shadowColor: colors.shadow }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  icon: {
    fontSize: 14,
  },
  title: {
    fontSize: 12,
    // fontFamily: FontLXGW,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  content: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
});

export default SettingsSection;
