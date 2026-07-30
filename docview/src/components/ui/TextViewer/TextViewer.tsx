import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { useTheme } from '../../../theme/useTheme';

interface TextViewerProps {
  filePath: string;
}

export function TextViewer({ filePath }: TextViewerProps) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();

  useEffect(() => {
    async function loadText() {
      try {
        const text = await FileSystem.readAsStringAsync(filePath);
        setContent(text);
      } catch (err) {
        console.error('Failed to read text file', err);
        setError('Could not read the file contents.');
      }
    }
    loadText();
  }, [filePath]);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-danger text-center">{error}</Text>
      </View>
    );
  }

  if (content === null) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.accent.primary} />
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 px-4 py-2"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text className="text-text-primary text-base font-mono">
        {content}
      </Text>
    </ScrollView>
  );
}
