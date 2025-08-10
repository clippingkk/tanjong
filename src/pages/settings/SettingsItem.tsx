import React from 'react';
import { View, Text, Pressable, StyleSheet, useColorScheme } from 'react-native';

type SettingsItemProps = {
  label: string;
  value?: string;
  icon?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  isLast?: boolean;
  isDanger?: boolean;
};

const lightColors = {
  text: '#1E293B',
  valueText: '#64748B',
  border: 'rgba(99, 102, 241, 0.1)',
  iconBg: 'rgba(99, 102, 241, 0.08)',
  hoverBg: 'rgba(99, 102, 241, 0.05)',
  dangerText: '#EF4444',
  dangerIconBg: 'rgba(239, 68, 68, 0.1)',
};

const darkColors = {
  text: '#E0E7FF',
  valueText: '#94A3B8',
  border: 'rgba(99, 102, 241, 0.2)',
  iconBg: 'rgba(99, 102, 241, 0.15)',
  hoverBg: 'rgba(99, 102, 241, 0.1)',
  dangerText: '#F87171',
  dangerIconBg: 'rgba(248, 113, 113, 0.15)',
};

const SettingsItem = ({ label, value, icon, onPress, children, isLast, isDanger }: SettingsItemProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && { backgroundColor: colors.hoverBg }
      ]}
      onPress={onPress}
    >
      <View style={[styles.content, { borderBottomColor: colors.border }, isLast && styles.noBorder]}>
        <View style={styles.leftContent}>
          {icon && (
            <View style={[
              styles.iconContainer,
              { backgroundColor: isDanger ? colors.dangerIconBg : colors.iconBg }
            ]}>
              <Text style={styles.icon}>{icon}</Text>
            </View>
          )}
          <Text style={[
            styles.label,
            { color: isDanger ? colors.dangerText : colors.text }
          ]}>
            {label}
          </Text>
        </View>
        <View style={styles.rightContent}>
          {value && (
            <Text style={[styles.value, { color: colors.valueText }]}>
              {value}
            </Text>
          )}
          {onPress && (
            <Text style={[styles.chevron, { color: colors.valueText }]}>›</Text>
          )}
        </View>
      </View>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  content: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: 15,
    // fontFamily: FontLXGW,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  value: {
    fontSize: 14,
    // fontFamily: FontLXGW,
    fontWeight: '600',
    marginRight: 8,
    opacity: 0.6,
  },
  chevron: {
    fontSize: 18,
    fontWeight: '400',
    opacity: 0.4,
  },
});

export default SettingsItem;
