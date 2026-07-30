import React from 'react';
import { View, Text, Image } from 'react-native';
import { Button } from '../Button/Button';
import { useTheme } from '../../../theme/useTheme';

interface EmptyStateProps {
  icon?: any;
  useLogo?: boolean;
  title: string;
  description: string;
  buttonLabel?: string;
  onButtonPress?: () => void;
  className?: string;
}

export function EmptyState({ 
  icon: IconComponent, 
  useLogo, 
  title, 
  description, 
  buttonLabel, 
  onButtonPress,
  className 
}: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View className={`flex-1 items-center justify-center p-6 ${className || ''}`}>
      {useLogo ? (
        <Image 
          source={require('../../../../assets/images/logo.png')} 
          className="w-32 h-32 mb-6 opacity-80"
          resizeMode="contain"
        />
      ) : IconComponent ? (
        <View className="w-20 h-20 rounded-full bg-bg-surface items-center justify-center mb-6 border border-border-subtle">
          <IconComponent size={40} color={colors.text.secondary} />
        </View>
      ) : null}
      
      <Text className="text-xl font-bold text-text-primary text-center mb-2">
        {title}
      </Text>
      
      <Text className="text-base text-text-secondary text-center mb-8 px-4 leading-6">
        {description}
      </Text>
      
      {buttonLabel && onButtonPress && (
        <Button 
          label={buttonLabel} 
          onPress={onButtonPress} 
          size="lg"
        />
      )}
    </View>
  );
}
