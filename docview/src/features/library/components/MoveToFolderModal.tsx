import React from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, TouchableWithoutFeedback } from 'react-native';
import { FolderRecord } from '../../../services/db/foldersRepository';

interface MoveToFolderModalProps {
  visible: boolean;
  folders: FolderRecord[];
  onClose: () => void;
  onSelectFolder: (folderId: string | null) => Promise<void>;
  currentFolderId: string | null;
}

export function MoveToFolderModal({ 
  visible, 
  folders, 
  onClose, 
  onSelectFolder,
  currentFolderId
}: MoveToFolderModalProps) {

  const handleSelect = async (folderId: string | null) => {
    try {
      await onSelectFolder(folderId);
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-end">
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="bg-bg-surface rounded-t-3xl p-6 pb-12 max-h-[70%]">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-bold text-text-primary">Move to...</Text>
                <TouchableOpacity onPress={onClose} className="p-2">
                  <Text className="text-text-secondary text-2xl">✕</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={[{ id: null, name: 'Library (Root)' }, ...folders]}
                keyExtractor={(item) => item.id || 'root'}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    className={`flex-row items-center p-4 border-b border-border-subtle ${
                      item.id === currentFolderId ? 'bg-accent-primary/10' : ''
                    }`}
                    onPress={() => handleSelect(item.id)}
                  >
                    <Text className="text-2xl mr-4">{item.id === null ? '🏠' : '📁'}</Text>
                    <Text className="text-text-primary text-base font-medium flex-1">
                      {item.name}
                    </Text>
                    {item.id === currentFolderId && (
                      <Text className="text-accent-primary text-xl">✓</Text>
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
