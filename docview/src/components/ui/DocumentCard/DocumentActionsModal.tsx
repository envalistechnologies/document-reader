import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, Dimensions } from 'react-native';
import { BookOpen, Share2, Edit3, Bookmark, Trash2, Info, X } from 'lucide-react-native';
import { useTheme } from '../../../theme/useTheme';
import { DocumentRecord, renameDocument, deleteDocument, toggleFavorite } from '../../../services/db/documentsRepository';
import { shareDocument } from '../../../services/sharing/shareDocument.service';
import { FileTypeIcon } from '../FileTypeIcon';

interface DocumentActionsModalProps {
  visible: boolean;
  document: DocumentRecord | null;
  onClose: () => void;
  onRefresh?: () => void;
  onOpen?: () => void;
}

export function DocumentActionsModal({ visible, document, onClose, onRefresh, onOpen }: DocumentActionsModalProps) {
  const { colors } = useTheme();

  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  if (!document) return null;

  const handleShare = async () => {
    try {
      await shareDocument(document);
    } catch (e) {
      Alert.alert('Error', 'Unable to share this document');
    }
  };

  const handleToggleFav = async () => {
    await toggleFavorite(document.id);
    onRefresh?.();
    onClose();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Document',
      `Are you sure you want to remove "${document.title}" from your library?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteDocument(document.id);
            onRefresh?.();
            onClose();
          },
        },
      ]
    );
  };

  const handleRenameSubmit = async () => {
    if (newTitle.trim()) {
      await renameDocument(document.id, newTitle.trim());
      setIsRenaming(false);
      onRefresh?.();
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <TouchableOpacity className="flex-1" onPress={onClose} activeOpacity={1} />
        
        <View className="bg-bg-surface rounded-t-3xl p-6" style={{ maxHeight: Dimensions.get('window').height * 0.8 }}>
          
          {/* Header File Card */}
          <View className="flex-row items-center bg-bg-elevated p-4 rounded-2xl mb-5 border border-border-subtle">
            <FileTypeIcon type={document.format} size="md" className="mr-3" />
            <View className="flex-1">
              <Text className="text-text-primary font-bold text-base" numberOfLines={1}>
                {document.title}
              </Text>
              <Text className="text-text-secondary text-xs mt-0.5" numberOfLines={1}>
                {document.format.toUpperCase()} • {formatFileSize(document.file_size_bytes)}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Details Modal Sub-view */}
          {showDetails ? (
            <View className="mb-4">
              <Text className="text-text-primary font-bold text-lg mb-3">Document Details</Text>
              <View className="bg-bg-elevated p-4 rounded-xl border border-border-subtle space-y-2">
                <Text className="text-text-secondary text-xs">Title: <Text className="text-text-primary font-medium">{document.title}</Text></Text>
                <Text className="text-text-secondary text-xs">Filename: <Text className="text-text-primary font-medium">{document.filename}</Text></Text>
                <Text className="text-text-secondary text-xs">Format: <Text className="text-text-primary font-medium">{document.format.toUpperCase()}</Text></Text>
                <Text className="text-text-secondary text-xs">Size: <Text className="text-text-primary font-medium">{formatFileSize(document.file_size_bytes)}</Text></Text>
                <Text className="text-text-secondary text-xs">Path/URI: <Text className="text-text-primary font-medium" numberOfLines={2}>{document.content_uri || document.file_path || 'External'}</Text></Text>
                <Text className="text-text-secondary text-xs">Imported: <Text className="text-text-primary font-medium">{new Date(document.imported_at).toLocaleString()}</Text></Text>
              </View>
              <TouchableOpacity onPress={() => setShowDetails(false)} className="mt-4 bg-accent-primary py-3 rounded-full items-center">
                <Text className="text-white font-bold">Back</Text>
              </TouchableOpacity>
            </View>
          ) : isRenaming ? (
            <View className="mb-4">
              <Text className="text-text-primary font-bold text-lg mb-3">Rename Document</Text>
              <TextInput
                className="bg-bg-elevated text-text-primary p-4 rounded-xl border border-border-subtle mb-4"
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="Enter new title"
                placeholderTextColor="#9CA3AF"
                autoFocus
              />
              <View className="flex-row gap-3">
                <TouchableOpacity onPress={() => setIsRenaming(false)} className="flex-1 bg-bg-elevated py-3 rounded-full items-center border border-border-subtle">
                  <Text className="text-text-primary font-semibold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRenameSubmit} className="flex-1 bg-accent-primary py-3 rounded-full items-center">
                  <Text className="text-white font-bold">Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* Action List */
            <View className="space-y-1">
              <TouchableOpacity
                onPress={() => { onClose(); onOpen?.(); }}
                className="flex-row items-center p-3.5 rounded-xl active:bg-bg-elevated"
              >
                <BookOpen size={20} color={colors.accent.primary} />
                <Text className="text-text-primary font-semibold text-base ml-4">Open Document</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleShare}
                className="flex-row items-center p-3.5 rounded-xl active:bg-bg-elevated"
              >
                <Share2 size={20} color="#3B82F6" />
                <Text className="text-text-primary font-semibold text-base ml-4">Share Document</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => { setNewTitle(document.title); setIsRenaming(true); }}
                className="flex-row items-center p-3.5 rounded-xl active:bg-bg-elevated"
              >
                <Edit3 size={20} color="#F59E0B" />
                <Text className="text-text-primary font-semibold text-base ml-4">Rename</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleToggleFav}
                className="flex-row items-center p-3.5 rounded-xl active:bg-bg-elevated"
              >
                <Bookmark size={20} color={document.is_favorite ? '#EF4444' : colors.text.secondary} fill={document.is_favorite ? '#EF4444' : 'transparent'} />
                <Text className="text-text-primary font-semibold text-base ml-4">
                  {document.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowDetails(true)}
                className="flex-row items-center p-3.5 rounded-xl active:bg-bg-elevated"
              >
                <Info size={20} color="#8B5CF6" />
                <Text className="text-text-primary font-semibold text-base ml-4">Document Details</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                className="flex-row items-center p-3.5 rounded-xl active:bg-bg-elevated"
              >
                <Trash2 size={20} color="#EF4444" />
                <Text className="text-red-500 font-semibold text-base ml-4">Delete Document</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>
      </View>
    </Modal>
  );
}
