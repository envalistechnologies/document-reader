import React from 'react';
import { View } from 'react-native';

interface DividerProps {
  inset?: boolean;
  className?: string;
}

export function Divider({ inset, className }: DividerProps) {
  return (
    <View 
      className={`h-[1px] bg-border-subtle ${inset ? 'ml-16' : ''} ${className || ''}`}
    />
  );
}
