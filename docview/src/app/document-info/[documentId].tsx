import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { AppBar } from '../../components/ui/AppBar/AppBar';
import { getDocumentById, DocumentRecord, deleteDocument } from '../../services/db/documentsRepository';
import { shareDocument } from '../../services/sharing/shareDocument.service';

import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function DocumentInfoScreen() {
  const { documentId } = useLocalSearchParams<{ documentId: string }>();
  const router = useRouter();
  
  const [document, setDocument] = useState<DocumentRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoc() {
      if (!documentId) return;
      const doc = await getDocumentById(documentId);
      setDocument(doc);
      setLoading(false);
    }
    fetchDoc();
  }, [documentId]);

  const handleShare = async () => {
    if (!document) return;
    try {
      await shareDocument(document);
    } catch (e) {
      Alert.alert('Error', 'Failed to share document.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to permanently delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            if (!document) return;
            try {
              await deleteDocument(document.id);
              // After delete, go back to library, since reader will be broken
              router.navigate('/');
            } catch (err) {
              Alert.alert('Error', 'Failed to delete document.');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <Screen>
        <AppBar leadingSlot={<BackButton />} title="Document Info" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      </Screen>
    );
  }

  if (!document) {
    return (
      <Screen>
        <AppBar leadingSlot={<BackButton />} title="Document Info" />
        <Text className="text-text-primary text-center p-4">Document not found.</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <AppBar leadingSlot={<BackButton />} title="Document Info" />
      
      <View className="p-4 flex-1">
        
        {/* Title */}
        <Text className="text-text-primary text-2xl font-bold mb-6">{document.title}</Text>
        
        {/* Metadata Details */}
        <View className="bg-bg-elevated rounded-xl p-4 mb-6">
          <InfoRow label="Original Filename" value={document.filename} />
          <InfoRow label="Format" value={document.format.toUpperCase()} />
          <InfoRow label="File Size" value={formatBytes(document.file_size_bytes)} />
          <InfoRow 
            label="Imported" 
            value={new Date(document.imported_at).toLocaleDateString()} 
          />
          <InfoRow 
            label="Last Opened" 
            value={document.last_opened_at ? new Date(document.last_opened_at).toLocaleDateString() : 'Never'} 
            isLast
          />
        </View>

        {/* Actions */}
        <TouchableOpacity 
          className="bg-accent-primary py-4 rounded-xl items-center mb-4"
          onPress={handleShare}
        >
          <Text className="text-white font-semibold text-lg">Share Document</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-danger/10 py-4 rounded-xl items-center"
          onPress={handleDelete}
        >
          <Text className="text-danger font-semibold text-lg">Delete Document</Text>
        </TouchableOpacity>

      </View>
    </Screen>
  );
}

function InfoRow({ label, value, isLast = false }: { label: string; value: string; isLast?: boolean }) {
  return (
    <View className={`flex-row justify-between py-3 ${!isLast ? 'border-b border-border-subtle' : ''}`}>
      <Text className="text-text-secondary">{label}</Text>
      <Text className="text-text-primary font-medium ml-4 shrink" numberOfLines={1}>{value}</Text>
    </View>
  );
}

function BackButton() {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={() => router.back()} className="p-2">
      <ChevronLeft size={24} color={colors.text.primary} />
    </TouchableOpacity>
  );
}
