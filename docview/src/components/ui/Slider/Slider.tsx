import React from 'react';
import { View, Text } from 'react-native';
import RNSlider, { SliderProps as RNSliderProps } from '@react-native-community/slider';

interface SliderProps extends RNSliderProps {
  label?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
}

export function Slider({ 
  label, 
  showValue, 
  valueFormatter = (val) => val.toFixed(1),
  className,
  ...rest 
}: SliderProps) {
  return (
    <View className={`py-2 ${className || ''}`}>
      {(label || showValue) && (
        <View className="flex-row justify-between mb-2">
          {label && <Text className="text-text-primary text-sm font-medium">{label}</Text>}
          {showValue && rest.value !== undefined && (
            <Text className="text-text-secondary text-sm font-mono">
              {valueFormatter(rest.value)}
            </Text>
          )}
        </View>
      )}
      <RNSlider
        minimumTrackTintColor="var(--color-accent-primary)"
        maximumTrackTintColor="var(--color-border-subtle)"
        thumbTintColor="var(--color-accent-primary)"
        {...rest}
      />
    </View>
  );
}
