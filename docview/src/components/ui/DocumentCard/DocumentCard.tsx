import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '../Card/Card';
import { Bookmark, MoreVertical } from 'lucide-react-native';
import { useTheme } from '../../../theme/useTheme';
import { FileTypeIcon } from '../FileTypeIcon';
import { DocumentRecord } from '../../../services/db/documentsRepository';
import { DocumentActionsModal } from './DocumentActionsModal';

interface DocumentCardProps {
  doc?: DocumentRecord;
  title: string;
  subtitle: string;
  format: string;
  onPress?: () => void;
  onMove?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onRefresh?: () => void;
  variant?: 'grid' | 'list';
}

export function DocumentCard({ doc, title, subtitle, format, onPress, onMove, isFavorite, onToggleFavorite, onRefresh, variant = 'list' }: DocumentCardProps) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const handleOptionsPress = () => {
    if (onMove) {
      onMove();
    } else if (doc) {
      setModalVisible(true);
    }
  };

  return (
    <>
      <Card onPress={onPress} className={variant === 'grid' ? "flex-1 m-2 p-3 items-center" : "flex-row p-3 mb-[2px] items-center bg-transparent border-0 shadow-none"}>
        <FileTypeIcon type={format} size={variant === 'grid' ? 'lg' : 'md'} className={variant === 'grid' ? "mb-3" : "mr-4"} />
        <View className={variant === 'grid' ? "items-center" : "flex-1 justify-center mr-2"}>
          <Text className="text-text-primary font-medium text-[15px] mb-1" numberOfLines={variant === 'grid' ? 2 : 1}>
            {title}
          </Text>
          <Text className="text-text-secondary text-xs" numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
        <View className="flex-row items-center">
          {onToggleFavorite && (
            <TouchableOpacity onPress={onToggleFavorite} className="p-2">
              <Bookmark color={isFavorite ? colors.accent.primary : colors.text.secondary} size={20} fill={isFavorite ? colors.accent.primary : 'transparent'} />
            </TouchableOpacity>
          )}
          {(onMove || doc) && (
            <TouchableOpacity onPress={handleOptionsPress} className="p-2">
              <MoreVertical color={colors.text.secondary} size={20} />
            </TouchableOpacity>
          )}
        </View>
      </Card>

      {doc && (
        <DocumentActionsModal
          visible={modalVisible}
          document={doc}
          onClose={() => setModalVisible(false)}
          onRefresh={onRefresh}
          onOpen={onPress}
        />
      )}
    </>
  );
}
