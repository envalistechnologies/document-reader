import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

interface ChipProps extends TouchableOpacityProps {
  label: string;
  selected?: boolean;
  variant?: 'filter' | 'status';
}

export function Chip({ 
  label, 
  selected = false, 
  variant = 'filter', 
  className,
  ...rest 
}: ChipProps) {
  
  if (variant === 'status') {
    return (
      <TouchableOpacity 
        className={`px-3 py-1 rounded-full bg-border-subtle ${className || ''}`}
        disabled
      >
        <Text className="text-text-secondary text-sm font-medium">{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      className={`px-4 py-1.5 rounded-full border ${
        selected 
          ? 'bg-accent-primary border-accent-primary' 
          : 'bg-bg-surface border-border-subtle'
      } ${className || ''}`}
      activeOpacity={0.7}
      {...rest}
    >
      <Text className={`text-sm font-medium ${selected ? 'text-white' : 'text-text-primary'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
