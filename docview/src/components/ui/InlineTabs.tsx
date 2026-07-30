import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface InlineTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  rightAction?: React.ReactNode;
}

export function InlineTabs({ tabs, activeTab, onTabChange, rightAction }: InlineTabsProps) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-bg-screen">
      <View className="flex-row space-x-6 gap-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => onTabChange(tab)}
              className="py-1 relative"
            >
              <Text 
                className={`text-lg font-bold ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}
              >
                {tab}
              </Text>
              {isActive && (
                <View className="absolute bottom-0 left-0 right-0 h-1 bg-text-primary rounded-full" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      {rightAction && (
        <View>
          {rightAction}
        </View>
      )}
    </View>
  );
}
