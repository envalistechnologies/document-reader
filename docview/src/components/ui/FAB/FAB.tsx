import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

interface FABProps extends TouchableOpacityProps {
  icon: any;
  label?: string;
}

export function FAB({ icon: IconComponent, label, className, ...rest }: FABProps) {
  return (
    <TouchableOpacity
      className={`absolute bottom-6 right-6 bg-accent-primary rounded-full shadow-lg items-center justify-center flex-row ${
        label ? 'px-5 py-4' : 'w-14 h-14'
      } ${className || ''}`}
      activeOpacity={0.8}
      {...rest}
    >
      <IconComponent color="white" size={24} />
      {label && <Text className="text-white font-semibold ml-2 text-base">{label}</Text>}
    </TouchableOpacity>
  );
}
