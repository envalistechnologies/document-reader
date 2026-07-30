import React from 'react';
import { View, Text } from 'react-native';
import { Folder, Image as ImageIcon, FileSearch } from 'lucide-react-native';

interface FileTypeIconProps {
  type: string;
  size?: 'md' | 'lg';
  className?: string;
}

export function FileTypeIcon({ type, size = 'md', className = '' }: FileTypeIconProps) {
  const isLarge = size === 'lg';
  const containerSize = isLarge ? 'w-14 h-14 rounded-2xl' : 'w-10 h-10 rounded-xl';
  const iconSize = isLarge ? 28 : 20;
  
  const getStyle = () => {
    switch (type.toLowerCase()) {
      case 'all':
        return { bg: 'bg-[#1a73e8]', type: 'icon', icon: Folder, color: 'white' };
      case 'pdf':
        return { bg: 'bg-[#ea4335]', type: 'text', text: 'PDF', color: 'white' };
      case 'word':
      case 'doc':
      case 'docx':
        return { bg: 'bg-[#2b579a]', type: 'text', text: 'W', color: 'white' };
      case 'excel':
      case 'xls':
      case 'xlsx':
        return { bg: 'bg-[#217346]', type: 'text', text: 'X', color: 'white' };
      case 'ppt':
      case 'pptx':
        return { bg: 'bg-[#d24726]', type: 'text', text: 'P', color: 'white' };
      case 'txt':
        return { bg: 'bg-[#7785F3]', type: 'text', text: 'T', color: 'white' };
      case 'image':
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'webp':
        return { bg: 'bg-[#fbbc04]', type: 'icon', icon: ImageIcon, color: 'white' };
      case 'directories':
        return { bg: 'bg-[#1a73e8]', type: 'icon', icon: FileSearch, color: 'white' };
      default:
        return { bg: 'bg-[#3c4043]', type: 'text', text: '?', color: 'white' };
    }
  };

  const style = getStyle();
  const Icon = style.icon;
  const textSizeClass = isLarge ? ((style.text?.length || 0) > 1 ? 'text-lg font-bold' : 'text-2xl font-bold') : ((style.text?.length || 0) > 1 ? 'text-xs font-bold' : 'text-lg font-bold');

  return (
    <View className={`${containerSize} ${style.bg} items-center justify-center ${className}`}>
      {style.type === 'icon' && Icon ? (
        <Icon size={iconSize} color={style.color} />
      ) : (
        <Text className={`${textSizeClass} text-white`}>{style.text}</Text>
      )}
    </View>
  );
}
