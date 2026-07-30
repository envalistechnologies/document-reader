import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useTheme } from '../../../theme/useTheme';

interface IconButtonProps extends TouchableOpacityProps {
  icon: any;
  variant?: 'default' | 'filled-circle';
  size?: number;
  color?: string;
}

export function IconButton({ 
  icon: IconComponent, 
  variant = 'default', 
  size = 24, 
  color,
  className,
  ...rest 
}: IconButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      className={`min-w-[44px] min-h-[44px] items-center justify-center ${
        variant === 'filled-circle' ? 'bg-bg-surface rounded-full p-2' : ''
      } ${className || ''}`}
      {...rest}
    >
      <IconComponent size={size} color={color || colors.text.primary} />
    </TouchableOpacity>
  );
}
