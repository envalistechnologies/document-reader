import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
  count?: number;
  status?: boolean;
  className?: string;
}

export function Badge({ count, status, className }: BadgeProps) {
  if (status) {
    return <View className={`w-3 h-3 rounded-full bg-accent-primary ${className || ''}`} />;
  }

  if (count === undefined) return null;

  return (
    <View className={`bg-danger rounded-full px-1.5 py-0.5 min-w-[20px] items-center justify-center ${className || ''}`}>
      <Text className="text-white text-[10px] font-bold">
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
}
