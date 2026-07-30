import React from 'react';
import { View } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 1
  className?: string;
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  const safeProgress = Math.max(0, Math.min(1, progress));
  
  return (
    <View className={`h-2 bg-border-subtle rounded-full overflow-hidden ${className || ''}`}>
      <View 
        className="h-full bg-accent-primary rounded-full" 
        style={{ width: `${safeProgress * 100}%` }}
      />
    </View>
  );
}
