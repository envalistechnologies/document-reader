import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface SegmentedControlProps {
  segments: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  className?: string;
}

export function SegmentedControl({ segments, selectedIndex, onChange, className }: SegmentedControlProps) {
  return (
    <View className={`flex-row p-1 bg-border-subtle rounded-lg ${className || ''}`}>
      {segments.map((segment, index) => {
        const isSelected = selectedIndex === index;
        return (
          <TouchableOpacity
            key={segment}
            className={`flex-1 py-2 items-center justify-center rounded-md ${
              isSelected ? 'bg-bg-surface shadow-sm' : ''
            }`}
            onPress={() => onChange(index)}
          >
            <Text className={`font-medium ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>
              {segment}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
