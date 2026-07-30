import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextField } from '../../../components/ui/TextField/TextField';

interface CreateFolderModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
}

export function CreateFolderModal({ visible, onClose, onCreate }: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!folderName.trim()) return;
    setIsSubmitting(true);
    try {
      await onCreate(folderName.trim());
      setFolderName('');
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFolderName('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View className="flex-1 bg-black/50 justify-center px-6">
          <TouchableWithoutFeedback onPress={() => {}}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <View className="bg-bg-surface p-6 rounded-2xl shadow-xl">
                <Text className="text-xl font-bold text-text-primary mb-4">Create New Folder</Text>
                
                <TextField
                  placeholder="Folder Name"
                  value={folderName}
                  onChangeText={setFolderName}
                  autoFocus
                  onSubmitEditing={handleCreate}
                />

                <View className="flex-row justify-end mt-6 space-x-4 gap-4">
                  <TouchableOpacity onPress={handleClose} disabled={isSubmitting} className="py-2 px-4">
                    <Text className="text-text-secondary font-medium text-base">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={handleCreate} 
                    disabled={isSubmitting || !folderName.trim()}
                    className={`py-2 px-6 rounded-lg ${
                      !folderName.trim() || isSubmitting ? 'bg-accent-primary/50' : 'bg-accent-primary'
                    }`}
                  >
                    <Text className="text-white font-semibold text-base">
                      {isSubmitting ? 'Creating...' : 'Create'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
