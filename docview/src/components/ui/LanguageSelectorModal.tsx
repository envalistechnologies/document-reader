import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';

interface LanguageSelectorModalProps {
  visible: boolean;
  currentLanguage: string;
  onClose: () => void;
  onSelect: (lang: string) => void;
}

const LANGUAGES = [
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'हिंदी' },
  { id: 'es', label: 'Español' },
  { id: 'fr', label: 'Français' },
  { id: 'de', label: 'Deutsch' },
  { id: 'ar', label: 'العربية' },
  { id: 'fa', label: 'فارسی' },
  { id: 'zh', label: '中文' },
];

export function LanguageSelectorModal({ visible, currentLanguage, onClose, onSelect }: LanguageSelectorModalProps) {
  const [selected, setSelected] = useState(currentLanguage);

  const handleOK = () => {
    onSelect(selected);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Dimmed Background overlay */}
      <View className="flex-1 justify-end bg-black/50">
        <TouchableOpacity className="flex-1" onPress={onClose} activeOpacity={1} />
        
        {/* Bottom Sheet Container */}
        <View className="bg-bg-surface rounded-t-3xl p-6" style={{ maxHeight: Dimensions.get('window').height * 0.7 }}>
          
          {/* Header */}
          <Text className="text-text-primary text-xl font-bold mb-4 ml-2">Language</Text>
          
          {/* List of Languages */}
          {LANGUAGES.map((lang) => {
            const isSelected = selected === lang.id;
            return (
              <TouchableOpacity
                key={lang.id}
                onPress={() => setSelected(lang.id)}
                className={`flex-row items-center justify-between p-4 rounded-xl mb-1 ${isSelected ? 'bg-accent-primary/10' : ''}`}
                activeOpacity={0.7}
              >
                <Text className={`text-base font-semibold ${isSelected ? 'text-accent-primary' : 'text-text-primary'}`}>
                  {lang.label}
                </Text>
                
                {/* Custom Radio Button */}
                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${isSelected ? 'border-accent-primary' : 'border-border-subtle'}`}>
                  {isSelected && <View className="w-3 h-3 rounded-full bg-accent-primary" />}
                </View>
              </TouchableOpacity>
            );
          })}
          
          {/* OK Button */}
          <TouchableOpacity 
            className="bg-accent-primary rounded-full py-4 items-center mt-6 shadow-sm"
            onPress={handleOK}
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg font-bold">OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
