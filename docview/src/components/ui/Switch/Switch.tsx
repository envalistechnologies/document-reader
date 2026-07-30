import React from 'react';
import { Switch as RNSwitch, SwitchProps as RNSwitchProps, View, Text } from 'react-native';

interface SwitchProps extends RNSwitchProps {
  label?: string;
  description?: string;
}

export function Switch({ label, description, className, ...rest }: SwitchProps) {
  const switchElement = (
    <RNSwitch
      trackColor={{ false: 'var(--color-border-subtle)', true: 'var(--color-accent-primary)' }}
      thumbColor={rest.value ? '#FFFFFF' : '#FFFFFF'}
      ios_backgroundColor="var(--color-border-subtle)"
      {...rest}
    />
  );

  if (label) {
    return (
      <View className={`flex-row items-center justify-between py-2 ${className || ''}`}>
        <View className="flex-1 mr-4">
          <Text className="text-text-primary text-base font-medium">{label}</Text>
          {description && <Text className="text-text-secondary text-sm mt-1">{description}</Text>}
        </View>
        {switchElement}
      </View>
    );
  }

  return switchElement;
}
