import React, { useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { AppBar } from '../../components/ui/AppBar/AppBar';
import { useStorageBreakdown } from '../../features/settings/hooks/useStorageBreakdown';
import { FreeUpSpaceSuggestions } from '../../features/settings/components/FreeUpSpaceSuggestions';
import { deleteDocument } from '../../services/db/documentsRepository';
import { useTheme } from '../../theme/useTheme';
import { ChevronLeft } from 'lucide-react-native';

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function StorageDetailScreen() {
  const router = useRouter();
  const { breakdown, isLoading, fetchBreakdown } = useStorageBreakdown();

  useEffect(() => {
    fetchBreakdown();
  }, [fetchBreakdown]);

  const handleDeleteRequest = (documentId: string) => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to permanently delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDocument(documentId);
              fetchBreakdown();
            } catch (err) {
              console.error(err);
            }
          }
        }
      ]
    );
  };

  if (isLoading || !breakdown) {
    return (
      <Screen>
        <AppBar leadingSlot={<BackButton />} title="Storage Details" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#5B7CFA" />
        </View>
      </Screen>
    );
  }

  // Calculate percentages for the progress bar
  const safeTotal = breakdown.totalBytes > 0 ? breakdown.totalBytes : 1;
  const docsPct = (breakdown.documentsBytes / safeTotal) * 100;
  const thumbPct = (breakdown.thumbnailsBytes / safeTotal) * 100;
  const cachePct = (breakdown.cacheBytes / safeTotal) * 100;

  return (
    <Screen>
      <AppBar leadingSlot={<BackButton />} title="Storage Details" />
      <ScrollView className="flex-1">
        
        {/* Premium Summary Card */}
        <View className="m-4 p-6 bg-bg-elevated rounded-[28px] shadow-sm border border-border-subtle">
          <Text className="text-text-secondary text-sm font-bold uppercase tracking-widest mb-1 text-center">
            Total Used
          </Text>
          <Text className="text-text-primary text-5xl font-extrabold text-center tracking-tight mb-8">
            {formatBytes(breakdown.totalBytes)}
          </Text>
          
          {/* Visual Storage Bar */}
          <View className="h-4 rounded-full bg-border-subtle flex-row overflow-hidden mb-6">
            <View style={{ width: `${docsPct}%` }} className="bg-accent-primary" />
            <View style={{ width: `${thumbPct}%` }} className="bg-amber-400" />
            <View style={{ width: `${cachePct}%` }} className="bg-emerald-400" />
          </View>

          {/* Legend */}
          <View className="flex-row justify-between w-full px-2">
            <View className="items-center">
              <View className="w-3 h-3 rounded-full bg-accent-primary mb-2" />
              <Text className="text-text-primary font-semibold">{formatBytes(breakdown.documentsBytes)}</Text>
              <Text className="text-text-secondary text-xs">Docs</Text>
            </View>
            <View className="items-center">
              <View className="w-3 h-3 rounded-full bg-amber-400 mb-2" />
              <Text className="text-text-primary font-semibold">{formatBytes(breakdown.thumbnailsBytes)}</Text>
              <Text className="text-text-secondary text-xs">Thumbs</Text>
            </View>
            <View className="items-center">
              <View className="w-3 h-3 rounded-full bg-emerald-400 mb-2" />
              <Text className="text-text-primary font-semibold">{formatBytes(breakdown.cacheBytes)}</Text>
              <Text className="text-text-secondary text-xs">Caches</Text>
            </View>
          </View>
        </View>

        {/* Free Up Space */}
        <FreeUpSpaceSuggestions breakdown={breakdown} onDeleteRequest={handleDeleteRequest} />

        {/* All Documents Breakdown */}
        <View className="mt-6 px-4 pb-12">
          <Text className="text-text-secondary text-sm font-bold uppercase tracking-widest mb-4 ml-2">
            Library Breakdown
          </Text>
          <View className="bg-bg-elevated rounded-2xl overflow-hidden border border-border-subtle">
            {breakdown.perDocument.map((doc, index) => (
              <TouchableOpacity 
                key={doc.documentId} 
                className={`flex-row justify-between items-center p-4 bg-bg-surface ${index < breakdown.perDocument.length - 1 ? 'border-b border-border-subtle' : ''}`}
                onPress={() => router.push(`/document-info/${doc.documentId}` as any)}
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-8 h-8 rounded-full bg-accent-primary/10 items-center justify-center mr-3">
                    <Text className="text-accent-primary font-bold text-xs">{index + 1}</Text>
                  </View>
                  <Text className="text-text-primary font-medium flex-1 mr-4" numberOfLines={1}>
                    {doc.title}
                  </Text>
                </View>
                <Text className="text-text-secondary text-sm font-semibold">
                  {formatBytes(doc.bytes)}
                </Text>
              </TouchableOpacity>
            ))}
            {breakdown.perDocument.length === 0 && (
              <View className="p-6 items-center justify-center bg-bg-surface">
                <Text className="text-text-secondary text-center">Your library is empty.</Text>
              </View>
            )}
          </View>
        </View>

      </ScrollView>
    </Screen>
  );
}

function BackButton() {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={() => router.back()} className="p-2 ml-2">
      <ChevronLeft size={24} color={colors.text.primary} />
    </TouchableOpacity>
  );
}
