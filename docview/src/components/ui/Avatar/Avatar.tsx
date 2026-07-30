import React from 'react';
import { View, Text, Image } from 'react-native';

interface AvatarProps {
  initials?: string;
  source?: any;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ initials, source, size = 'md', className }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-full',
    md: 'w-12 h-12 rounded-full',
    lg: 'w-16 h-16 rounded-full',
  };

  const textClasses = {
    sm: 'text-xs',
    md: 'text-base',
    lg: 'text-xl',
  };

  if (source) {
    return (
      <Image 
        source={source} 
        className={`${sizeClasses[size]} bg-border-subtle ${className || ''}`}
      />
    );
  }

  return (
    <View className={`${sizeClasses[size]} bg-border-subtle items-center justify-center ${className || ''}`}>
      {initials && (
        <Text className={`${textClasses[size]} text-text-primary font-medium`}>
          {initials.substring(0, 2).toUpperCase()}
        </Text>
      )}
    </View>
  );
}
