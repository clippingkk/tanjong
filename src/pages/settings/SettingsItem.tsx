import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

type SettingsItemProps = {
  label: string;
  value?: string;
  onPress?: () => void;
  children?: React.ReactNode;
};

const SettingsItem = ({ label, value, onPress, children }: SettingsItemProps) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        {value && <Text style={styles.value}>{value}</Text>}
      </View>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    color: '#666',
  },
});

export default SettingsItem;
