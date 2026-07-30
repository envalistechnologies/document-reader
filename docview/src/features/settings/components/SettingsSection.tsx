import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <View className="mb-6">
      <Text className="text-text-secondary text-sm font-semibold uppercase tracking-wider mb-2 px-4">
        {title}
      </Text>
      <View className="bg-bg-elevated rounded-xl overflow-hidden mx-4">
        {children}
      </View>
    </View>
  );
}
