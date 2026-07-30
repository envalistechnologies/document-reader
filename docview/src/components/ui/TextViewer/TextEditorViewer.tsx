import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { Save, Edit2, Eye, Check, RefreshCw } from 'lucide-react-native';
import { useTheme } from '../../../theme/useTheme';

interface TextEditorViewerProps {
  filePath: string;
  onSaved?: () => void;
}

async function safeReadText(uri: string): Promise<string> {
  try {
    return await FileSystem.readAsStringAsync(uri);
  } catch (err1) {
    if (uri.startsWith('file://')) {
      const cleanPath = decodeURIComponent(uri.replace('file://', ''));
      return await FileSystem.readAsStringAsync(cleanPath);
    }
    throw err1;
  }
}

async function safeWriteText(uri: string, content: string): Promise<void> {
  try {
    await FileSystem.writeAsStringAsync(uri, content);
  } catch (err1) {
    if (uri.startsWith('file://')) {
      const cleanPath = decodeURIComponent(uri.replace('file://', ''));
      await FileSystem.writeAsStringAsync(cleanPath, content);
      return;
    }
    throw err1;
  }
}

export function TextEditorViewer({ filePath, onSaved }: TextEditorViewerProps) {
  const [content, setContent] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();

  useEffect(() => {
    async function loadText() {
      try {
        const text = await safeReadText(filePath);
        setContent(text);
        setEditedContent(text);
      } catch (err) {
        console.error('Failed to read text file', err);
        setError('Could not read the file contents.');
      }
    }
    loadText();
  }, [filePath]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await safeWriteText(filePath, editedContent);
      setContent(editedContent);
      setIsEditing(false);
      Alert.alert('File Saved', 'Your changes have been saved successfully.');
      onSaved?.();
    } catch (err) {
      console.error('Failed to save file', err);
      Alert.alert('Save Failed', 'Unable to write changes to this file.');
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-danger text-center font-medium">{error}</Text>
      </View>
    );
  }

  if (content === null) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.accent.primary} />
        <Text className="text-text-secondary mt-3">Loading File...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Editor Control Bar */}
      <View className="flex-row items-center justify-between px-4 py-2.5 bg-bg-surface border-b border-border-subtle">
        <Text className="text-text-secondary text-xs font-bold uppercase tracking-wider">
          {isEditing ? 'Editing Mode' : 'Read-Only Mode'}
        </Text>

        <View className="flex-row items-center gap-2">
          {isEditing ? (
            <>
              <TouchableOpacity
                onPress={() => { setIsEditing(false); setEditedContent(content); }}
                className="px-3 py-1.5 bg-bg-elevated rounded-lg border border-border-subtle"
              >
                <Text className="text-text-primary text-xs font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                disabled={saving}
                className="flex-row items-center px-4 py-1.5 bg-accent-primary rounded-lg shadow-sm"
              >
                {saving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Save size={14} color="white" />
                    <Text className="text-white text-xs font-bold ml-1.5">Save</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              className="flex-row items-center px-3.5 py-1.5 bg-accent-primary/10 rounded-lg border border-accent-primary/30"
            >
              <Edit2 size={14} color={colors.accent.primary} />
              <Text className="text-accent-primary text-xs font-bold ml-1.5">Edit File</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Editor Input or Text View */}
      {isEditing ? (
        <ScrollView className="flex-1 p-4 bg-bg-base">
          <TextInput
            className="text-text-primary text-base font-mono leading-6 p-2 min-h-[300px]"
            multiline
            textAlignVertical="top"
            value={editedContent}
            onChangeText={setEditedContent}
            placeholder="Type document content..."
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </ScrollView>
      ) : (
        <ScrollView 
          className="flex-1 px-4 py-3 bg-bg-base"
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          <Text className="text-text-primary text-base font-mono leading-6">
            {content}
          </Text>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}
