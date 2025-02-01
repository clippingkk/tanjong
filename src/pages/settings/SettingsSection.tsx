import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type SettingsSectionProps = {
  title?: string;
  children: React.ReactNode;
};

const SettingsSection = ({ title, children }: SettingsSectionProps) => {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  title: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 13,
    color: '#666',
    textTransform: 'uppercase',
  },
  content: {
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
});

export default SettingsSection;
