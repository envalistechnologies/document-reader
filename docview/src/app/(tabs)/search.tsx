import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, View, TouchableOpacity, Text, TextInput, ScrollView } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { AppBar } from '../../components/ui/AppBar/AppBar';
import { EmptyState } from '../../components/ui/EmptyState/EmptyState';
import { AdBanner } from '../../components/ui/AdBanner/AdBanner';
import { Search as SearchIcon, X, SlidersHorizontal } from 'lucide-react-native';
import { DocumentCard } from '../../components/ui/DocumentCard/DocumentCard';
import { useTheme } from '../../theme/useTheme';
import { useRouter, useFocusEffect } from 'expo-router';
import { searchDocuments, getAllDocuments, toggleFavorite, DocumentRecord } from '../../services/db/documentsRepository';
import { useTranslation } from 'react-i18next';

const QUICK_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'pdf', label: 'PDF' },
  { id: 'word', label: 'Word' },
  { id: 'excel', label: 'Excel' },
  { id: 'ppt', label: 'PPT' },
  { id: 'txt', label: 'TXT' },
  { id: 'image', label: 'Images' },
];

const isFormatMatch = (docFormat: string, filterId: string) => {
  if (!filterId || filterId === 'all') return true;
  const f = (docFormat || '').toLowerCase();
  if (filterId === 'pdf') return f === 'pdf';
  if (filterId === 'word') return ['doc', 'docx', 'odt', 'rtf'].includes(f);
  if (filterId === 'excel') return ['xls', 'xlsx', 'csv'].includes(f);
  if (filterId === 'ppt') return ['ppt', 'pptx'].includes(f);
  if (filterId === 'txt') return f === 'txt';
  if (filterId === 'image') return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic'].includes(f);
  return f === filterId;
};

export default function SearchScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [results, setResults] = useState<DocumentRecord[]>([]);

  const fetchAndFilterDocuments = useCallback(async () => {
    try {
      let docs: DocumentRecord[] = [];
      if (query.trim()) {
        docs = await searchDocuments(query.trim());
      } else {
        docs = await getAllDocuments();
      }

      if (activeFilter && activeFilter !== 'all') {
        docs = docs.filter((d) => isFormatMatch(d.format, activeFilter));
      }
      setResults(docs);
    } catch (err) {
      console.error('Search error:', err);
    }
  }, [query, activeFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchAndFilterDocuments, 150);
    return () => clearTimeout(timer);
  }, [fetchAndFilterDocuments]);

  useFocusEffect(
    useCallback(() => {
      fetchAndFilterDocuments();
    }, [fetchAndFilterDocuments])
  );

  const handleToggleFavorite = async (docId: string) => {
    await toggleFavorite(docId);
    fetchAndFilterDocuments();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Screen>
      <AppBar title={t('common.search')} />

      {/* Search Input Bar */}
      <View className="px-4 py-3 bg-bg-surface border-b border-border-subtle">
        <View className="flex-row items-center bg-bg-elevated px-4 py-3 rounded-2xl border border-border-subtle">
          <SearchIcon size={20} color={colors.text.secondary} />
          <TextInput
            className="flex-1 text-text-primary text-base ml-3"
            placeholder={t('search.placeholder')}
            placeholderTextColor={colors.text.secondary}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} className="p-1">
              <X size={18} color={colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Format Filter Chips */}
        <View className="flex-row items-center mt-3">
          <View className="flex-row items-center mr-2">
            <SlidersHorizontal size={14} color={colors.text.secondary} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {QUICK_FILTERS.map((f) => {
              const isSelected = activeFilter === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  onPress={() => setActiveFilter(f.id)}
                  className={`px-3.5 py-1.5 rounded-full border ${isSelected ? 'bg-accent-primary border-accent-primary' : 'bg-bg-elevated border-border-subtle'}`}
                  activeOpacity={0.7}
                >
                  <Text className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-text-primary'}`}>
                    {f.id === 'all' ? t('common.all') : f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Results Header */}
      <View className="px-4 py-2 bg-bg-base border-b border-border-subtle flex-row justify-between items-center">
        <Text className="text-text-secondary text-xs font-semibold">
          {t('documents.filesCount', { count: results.length })}
        </Text>
      </View>

      {/* Document List / Empty State */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListEmptyComponent={
          !query.trim() && activeFilter === 'all' ? (
            <EmptyState
              title={t('search.emptyInitial')}
              description={t('search.emptyDesc')}
            />
          ) : (
            <EmptyState
              title={t('search.noMatching')}
              description={t('search.tryDifferent')}
            />
          )
        }
        renderItem={({ item }) => (
          <DocumentCard
            doc={item}
            title={item.title}
            subtitle={`${formatFileSize(item.file_size_bytes)} • ${item.format.toUpperCase()}`}
            format={item.format}
            isFavorite={item.is_favorite === 1}
            onToggleFavorite={() => handleToggleFavorite(item.id)}
            onRefresh={fetchAndFilterDocuments}
            onPress={() => router.push(`/reader/${item.id}`)}
          />
        )}
      />

      {/* AdMob Bottom Banner */}
      <AdBanner />
    </Screen>
  );
}

