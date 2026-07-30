import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StorageBreakdown } from '../../../services/storage/storageUsage.service';

interface Props {
  breakdown: StorageBreakdown;
  onDeleteRequest: (documentId: string) => void;
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function FreeUpSpaceSuggestions({ breakdown, onDeleteRequest }: Props) {
  const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
  
  // Find top 3 largest documents not opened in 90 days (or never opened)
  const suggestions = breakdown.perDocument
    .filter(doc => (doc.lastOpenedAt === null) || (doc.lastOpenedAt < ninetyDaysAgo))
    .slice(0, 3);

  if (suggestions.length === 0) {
    return null; // No suggestions needed
  }

  return (
    <View className="mt-8 mb-4 px-4">
      <Text className="text-text-primary text-lg font-bold mb-2">Free Up Space</Text>
      <Text className="text-text-secondary text-sm mb-4">
        These are large files you haven't opened in over 90 days.
      </Text>
      
      {suggestions.map(doc => (
        <View key={doc.documentId} className="flex-row items-center justify-between bg-bg-elevated p-4 rounded-xl mb-2">
          <View className="flex-1 mr-4">
            <Text className="text-text-primary font-semibold truncate" numberOfLines={1}>
              {doc.title}
            </Text>
            <Text className="text-text-secondary text-sm mt-1">
              {formatBytes(doc.bytes)}
            </Text>
          </View>
          <TouchableOpacity 
            className="bg-danger/10 px-4 py-2 rounded-lg"
            onPress={() => onDeleteRequest(doc.documentId)}
          >
            <Text className="text-danger font-semibold">Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
