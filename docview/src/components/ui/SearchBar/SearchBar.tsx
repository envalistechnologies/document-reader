import React from 'react';
import { View, TextInput, TextInputProps, Pressable } from 'react-native';
import { useTheme } from '../../../theme/useTheme';
import { IconButton } from '../IconButton/IconButton';
import { Search as SearchIcon, Filter, X } from 'lucide-react-native';

interface SearchBarProps extends TextInputProps {
  onClear?: () => void;
  onVoiceSearch?: () => void;
  onFilterPress?: () => void;
  showVoiceIcon?: boolean;
}

export function SearchBar({ 
  value, 
  onClear, 
  onVoiceSearch, 
  onFilterPress,
  showVoiceIcon = false,
  className,
  ...rest 
}: SearchBarProps) {
  const { colors } = useTheme();

  return (
    <View className={`
      flex-row items-center border px-3 h-12 rounded-full 
      bg-bg-surface border-border-subtle ${className || ''}
    `}>
      <SearchIcon color={colors.text.secondary} size={20} className="mr-2" />
      <TextInput
        className="flex-1 h-full text-text-primary"
        placeholderTextColor={colors.text.secondary}
        value={value}
        {...rest}
      />
      {value ? (
        <IconButton 
          icon={X} 
          size={20} 
          color={colors.text.secondary} 
          onPress={onClear} 
          className="ml-1 !min-w-[32px] !min-h-[32px]"
        />
      ) : showVoiceIcon ? (
        <IconButton 
          icon={SearchIcon}
          size={20} 
          color={colors.text.secondary} 
          onPress={onVoiceSearch} 
          className="ml-1 !min-w-[32px] !min-h-[32px]"
        />
      ) : null}
      {onFilterPress && (
        <>
          <View className="w-[1px] h-6 bg-border-subtle mx-2" />
          <Pressable onPress={onFilterPress} className="p-1">
            <Filter color={colors.text.secondary} size={20} />
          </Pressable>
        </>
      )}
    </View>
  );
}
