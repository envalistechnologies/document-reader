import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

interface SkeletonProps {
  variant?: 'card' | 'list-row' | 'text';
  className?: string;
}

export function Skeleton({ variant = 'text', className }: SkeletonProps) {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.5, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (variant === 'card') {
    return (
      <Animated.View className={`border border-border-subtle p-4 rounded-xl bg-bg-surface ${className || ''}`} style={animatedStyle}>
        <View className="w-full h-32 bg-border-subtle rounded-md mb-4" />
        <View className="w-3/4 h-4 bg-border-subtle rounded mb-2" />
        <View className="w-1/2 h-4 bg-border-subtle rounded" />
      </Animated.View>
    );
  }

  if (variant === 'list-row') {
    return (
      <Animated.View className={`flex-row items-center p-4 border-b border-border-subtle bg-bg-surface ${className || ''}`} style={animatedStyle}>
        <View className="w-10 h-10 rounded-full bg-border-subtle mr-4" />
        <View className="flex-1">
          <View className="w-3/4 h-4 bg-border-subtle rounded mb-2" />
          <View className="w-1/2 h-3 bg-border-subtle rounded" />
        </View>
      </Animated.View>
    );
  }

  return <Animated.View className={`bg-border-subtle rounded h-4 w-full ${className || ''}`} style={animatedStyle} />;
}
