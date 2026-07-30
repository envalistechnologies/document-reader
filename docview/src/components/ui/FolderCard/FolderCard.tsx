import React from 'react';
import { View, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface FolderCardProps extends TouchableOpacityProps {
  name: string;
  count?: number; // Optional count of documents inside
}

export function FolderCard({ name, count, className, ...rest }: FolderCardProps) {
  return (
    <TouchableOpacity
      className={`flex-row items-center p-4 bg-bg-surface border-b border-border-subtle ${className || ''}`}
      activeOpacity={0.7}
      {...rest}
    >
      <View className="w-10 h-10 rounded-xl bg-accent-secondary items-center justify-center mr-4">
        <Text className="text-xl">📁</Text>
      </View>
      <View className="flex-1 justify-center">
        <Text className="text-text-primary text-base font-semibold" numberOfLines={1}>
          {name}
        </Text>
        {count !== undefined && (
          <Text className="text-text-secondary text-sm mt-1">
            {count} document{count !== 1 ? 's' : ''}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
