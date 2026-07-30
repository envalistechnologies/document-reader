import React, { useState, useCallback } from 'react';
import { FlatList, View, Text } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { AppBar } from '../../components/ui/AppBar/AppBar';
import { EmptyState } from '../../components/ui/EmptyState/EmptyState';
import { AdBanner } from '../../components/ui/AdBanner/AdBanner';
import { DocumentCard } from '../../components/ui/DocumentCard/DocumentCard';
import { Star } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';
import { useFocusEffect, useRouter } from 'expo-router';
import { getFavoriteDocuments, toggleFavorite, DocumentRecord } from '../../services/db/documentsRepository';
import { useTranslation } from 'react-i18next';

export default function FavoritesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState<DocumentRecord[]>([]);

  const loadFavorites = useCallback(async () => {
    try {
      const docs = await getFavoriteDocuments();
      setFavorites(docs);
    } catch (e) {
      console.warn("Failed to load favorites", e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const handleToggleFavorite = async (docId: string) => {
    await toggleFavorite(docId);
    loadFavorites();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Screen>
      <AppBar 
        title={t('common.favorites')} 
        trailingSlot={
          <View className="flex-row items-center space-x-2 pr-2">
            <Star size={20} color="#F59E0B" fill="#F59E0B" />
            <Text className="text-text-primary font-bold text-sm ml-1">
              {t('favorites.starredCount', { count: favorites.length })}
            </Text>
          </View>
        }
      />

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListEmptyComponent={
          <EmptyState
            title={t('favorites.emptyTitle')}
            description={t('favorites.emptyDesc')}
          />
        }
        renderItem={({ item }) => (
          <DocumentCard
            doc={item}
            title={item.title}
            subtitle={`${formatFileSize(item.file_size_bytes)} • ${item.format.toUpperCase()}`}
            format={item.format}
            isFavorite={true}
            onToggleFavorite={() => handleToggleFavorite(item.id)}
            onRefresh={loadFavorites}
            onPress={() => router.push(`/reader/${item.id}`)}
          />
        )}
      />

      {/* AdMob Bottom Banner */}
      <AdBanner />
    </Screen>
  );
}
