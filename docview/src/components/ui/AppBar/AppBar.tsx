import React from 'react';
import { View, Text } from 'react-native';

interface AppBarProps {
  title: string;
  leadingSlot?: React.ReactNode;
  trailingSlot?: React.ReactNode;
  className?: string;
}

export function AppBar({ title, leadingSlot, trailingSlot, className }: AppBarProps) {
  return (
    <View className={`h-14 flex-row items-center px-4 bg-bg-base border-b border-border-subtle ${className || ''}`}>
      <View className="flex-1 items-start justify-center">
        {leadingSlot}
      </View>
      
      <View className="flex-[2] items-center justify-center">
        <Text className="text-lg font-bold text-text-primary" numberOfLines={1}>
          {title}
        </Text>
      </View>
      
      <View className="flex-1 items-end justify-center">
        {trailingSlot}
      </View>
    </View>
  );
}
