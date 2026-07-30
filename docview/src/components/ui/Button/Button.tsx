import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps, View } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'text' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({ 
  label, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled,
  className,
  ...rest 
}: ButtonProps) {
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-transparent border-accent-primary border';
      case 'destructive':
        return 'bg-danger border-danger border';
      case 'text':
        return 'bg-transparent';
      case 'primary':
      default:
        return 'bg-accent-primary border-accent-primary border';
    }
  };

  const getTextVariantClasses = () => {
    switch (variant) {
      case 'secondary':
      case 'text':
        return 'text-accent-primary';
      case 'destructive':
      case 'primary':
      default:
        return 'text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'py-1 px-2';
      case 'lg': return 'py-4 px-6';
      case 'md':
      default: return 'py-2 px-4';
    }
  };
  
  const getTextSizeClasses = () => {
    switch (size) {
      case 'sm': return 'text-sm';
      case 'lg': return 'text-lg';
      case 'md':
      default: return 'text-base';
    }
  };

  return (
    <TouchableOpacity
      className={`items-center justify-center flex-row rounded-md ${getVariantClasses()} ${getSizeClasses()} ${(disabled || loading) ? 'opacity-60' : ''} ${className || ''}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'destructive' ? 'white' : '#3454D1'} />
      ) : (
        <Text className={`font-semibold ${getTextVariantClasses()} ${getTextSizeClasses()}`}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
