import React from 'react';
import { View, Text, Pressable, StyleSheet, useColorScheme } from 'react-native';
import { FontLXGW } from '../../styles/font';

type SettingsItemProps = {
  label: string;
  value?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  isLast?: boolean;
};

const lightColors = {
  text: '#000',
  valueText: '#666',
  border: 'rgba(0,0,0,0.1)',
};

const darkColors = {
  text: '#fff',
  valueText: '#ccc',
  border: 'rgba(255,255,255,0.2)',
};

const SettingsItem = ({ label, value, onPress, children, isLast }: SettingsItemProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={[styles.content, { borderBottomColor: colors.border }, isLast && styles.noBorder]}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        {value && <Text style={[styles.value, { color: colors.valueText }]}>{value}</Text>}
      </View>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  content: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  label: {
    fontSize: 16,
    fontFamily: FontLXGW,
  },
  value: {
    fontSize: 16,
    fontFamily: FontLXGW,
  },
});

export default SettingsItem;
