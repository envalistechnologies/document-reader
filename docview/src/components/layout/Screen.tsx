import React from 'react';
import { View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
  isReader?: boolean;
}

export function Screen({ children, isReader = false, className, ...rest }: ScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-bg-base">
      <View 
        className={`flex-1 ${isReader ? 'bg-bg-paper' : 'bg-bg-base'} ${className || ''}`}
        {...rest}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}
