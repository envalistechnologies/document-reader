import React from 'react';
import { View, TouchableOpacity, ViewProps, TouchableOpacityProps } from 'react-native';

interface CardProps extends ViewProps {
  onPress?: TouchableOpacityProps['onPress'];
  children: React.ReactNode;
}

export function Card({ onPress, children, className, ...rest }: CardProps) {
  const containerClasses = `
    border p-4 overflow-hidden rounded-xl bg-bg-surface border-border-subtle ${className || ''}
  `;

  if (onPress) {
    return (
      <TouchableOpacity 
        className={containerClasses} 
        onPress={onPress} 
        activeOpacity={0.7}
        {...(rest as any)}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View className={containerClasses} {...rest}>
      {children}
    </View>
  );
}
