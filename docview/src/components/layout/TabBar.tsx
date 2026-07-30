import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, FolderClosed, Search, Star, Settings } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-row h-[65px] border-t pb-[15px] pt-[8px] bg-bg-surface border-border-subtle">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        let IconComponent = Home;
        if (route.name === 'documents') IconComponent = FolderClosed;
        if (route.name === 'search') IconComponent = Search;
        if (route.name === 'favorites') IconComponent = Star;
        if (route.name === 'settings') IconComponent = Settings;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            className="flex-1 items-center justify-center"
          >
            <IconComponent 
              size={20} 
              color={isFocused ? colors.accent.primary : colors.text.secondary} 
              fill={route.name === 'favorites' && isFocused ? colors.accent.primary : 'transparent'}
            />
            <Text 
              className={`text-[10px] mt-1 ${isFocused ? 'text-accent-primary font-semibold' : 'text-text-secondary'}`}
            >
              {label as string}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
