import React from 'react';
import { Modal, View, Text } from 'react-native';
import { Button } from '../Button/Button';

interface AlertDialogProps {
  visible: boolean;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function AlertDialog({
  visible,
  title,
  description,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  onCancel,
  onConfirm
}: AlertDialogProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/50 items-center justify-center p-6">
        <View className="bg-bg-surface w-full max-w-sm rounded-2xl p-6 shadow-lg">
          <Text className="text-xl font-bold text-text-primary mb-2">
            {title}
          </Text>
          <Text className="text-base text-text-secondary mb-6 leading-6">
            {description}
          </Text>
          <View className="flex-row justify-end gap-3">
            <Button
              variant="text"
              label={cancelText}
              onPress={onCancel}
            />
            <Button
              variant="primary"
              label={confirmText}
              onPress={onConfirm}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
