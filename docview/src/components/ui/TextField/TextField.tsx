import React from 'react';
import { View, TextInput, TextInputProps, Text, Pressable } from 'react-native';
import { useTheme } from '../../../theme/useTheme';

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  leadingIcon?: any;
  trailingIcon?: any;
  onTrailingIconPress?: () => void;
}

export function TextField({ 
  label, 
  error, 
  leadingIcon: LeadingIconComponent, 
  trailingIcon: TrailingIconComponent, 
  onTrailingIconPress,
  className,
  ...rest 
}: TextFieldProps) {
  const { colors } = useTheme();

  return (
    <View className={`mb-4 ${className || ''}`}>
      {label && <Text className="mb-2 font-medium text-text-primary">{label}</Text>}
      <View className={`
        flex-row items-center border px-3 h-12 rounded-md bg-bg-surface
        ${error ? 'border-danger' : 'border-border-subtle'}
      `}>
        {LeadingIconComponent && (
          <View className="mr-2">
            <LeadingIconComponent color={colors.text.secondary} size={20} />
          </View>
        )}
        <TextInput
          className="flex-1 h-full text-text-primary"
          placeholderTextColor={colors.text.secondary}
          {...rest}
        />
        {TrailingIconComponent && (
          <Pressable onPress={onTrailingIconPress} className="ml-2 p-1">
            <TrailingIconComponent 
              color={colors.text.secondary} 
              size={20} 
            />
          </Pressable>
        )}
      </View>
      {error && <Text className="mt-1 text-xs text-danger">{error}</Text>}
    </View>
  );
}
