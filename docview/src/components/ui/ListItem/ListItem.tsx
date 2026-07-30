import React from 'react';
import { View, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useTheme } from '../../../theme/useTheme';
import { ChevronRight } from 'lucide-react-native';

interface ListItemProps extends TouchableOpacityProps {
  title: string;
  subtitle?: string;
  leadingIcon?: any;
  trailingElement?: React.ReactNode;
  showChevron?: boolean;
}

export function ListItem({ 
  title, 
  subtitle, 
  leadingIcon: LeadingIconComponent, 
  trailingElement,
  showChevron,
  className,
  ...rest 
}: ListItemProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      className={`flex-row items-center p-4 bg-bg-surface border-b border-border-subtle ${className || ''}`}
      activeOpacity={0.7}
      {...rest}
    >
      {LeadingIconComponent && (
        <View className="w-10 h-10 rounded-full bg-border-subtle items-center justify-center mr-4">
          <LeadingIconComponent color={colors.text.secondary} size={20} />
        </View>
      )}
      <View className="flex-1 justify-center">
        <Text className="text-text-primary text-base font-medium">{title}</Text>
        {subtitle && <Text className="text-text-secondary text-sm mt-0.5">{subtitle}</Text>}
      </View>
      {trailingElement && <View className="ml-2">{trailingElement}</View>}
      {showChevron && !trailingElement && (
        <ChevronRight color={colors.text.secondary} size={20} className="ml-2" />
      )}
    </TouchableOpacity>
  );
}
