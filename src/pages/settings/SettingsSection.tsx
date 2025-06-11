import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { FontLXGW } from '../../styles/font';

type SettingsSectionProps = {
  title?: string;
  children: React.ReactNode;
};

const lightColors = {
  background: 'rgba(255, 255, 255, 0.8)',
  title: '#666',
  shadow: '#000',
};

const darkColors = {
  background: 'rgba(50, 50, 50, 0.6)',
  title: '#ccc',
  shadow: '#fff',
};

const SettingsSection = ({ title, children }: SettingsSectionProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <View style={styles.container}>
      {title && <Text style={[styles.title, { color: colors.title }]}>{title}</Text>}
      <View style={[styles.content, { backgroundColor: colors.background, shadowColor: colors.shadow }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    fontSize: 14,
    fontFamily: FontLXGW,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  content: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});

export default SettingsSection;
