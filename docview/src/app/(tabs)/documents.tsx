import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, View, TouchableOpacity, Text, ScrollView, Modal } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { AppBar } from '../../components/ui/AppBar/AppBar';
import { EmptyState } from '../../components/ui/EmptyState/EmptyState';
import { AdBanner } from '../../components/ui/AdBanner/AdBanner';
import { FAB } from '../../components/ui/FAB/FAB';
import { ArrowDownUp, LayoutGrid, List, Copy, Check, FilePlus } from 'lucide-react-native';
import { DocumentCard } from '../../components/ui/DocumentCard/DocumentCard';
import { useTheme } from '../../theme/useTheme';
import { useFocusEffect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { 
  getDocumentsSorted, 
  getDuplicateDocuments, 
  toggleFavorite, 
  DocumentRecord 
} from '../../services/db/documentsRepository';

export default function DocumentsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [activeCategory, setActiveCategory] = useState('all');
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [duplicates, setDuplicates] = useState<DocumentRecord[]>([]);
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Sorting state
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [showSortModal, setShowSortModal] = useState(false);

  const categoryPills = [
    { id: 'all', label: t('common.all') },
    { id: 'pdf', label: t('common.pdf') },
    { id: 'word', label: t('common.word') },
    { id: 'excel', label: t('common.excel') },
    { id: 'ppt', label: t('common.ppt') },
    { id: 'txt', label: t('common.txt') },
    { id: 'image', label: t('common.image') },
  ];

  const loadData = useCallback(async () => {
    try {
      if (showDuplicatesOnly) {
        const dups = await getDuplicateDocuments();
        setDuplicates(dups);
        setDocuments(dups);
      } else {
        const docs = await getDocumentsSorted(activeCategory, sortBy, sortOrder);
        setDocuments(docs);
        const dups = await getDuplicateDocuments();
        setDuplicates(dups);
      }
    } catch (e) {
      console.warn("Failed to load documents", e);
    }
  }, [activeCategory, sortBy, sortOrder, showDuplicatesOnly]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleToggleFavorite = async (docId: string) => {
    await toggleFavorite(docId);
    loadData();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Screen>
      <AppBar 
        title={t('common.docview')} 
        trailingSlot={
          <View className="flex-row items-center gap-3 pr-2">
            {/* Duplicates indicator button */}
            <TouchableOpacity 
              onPress={() => setShowDuplicatesOnly(!showDuplicatesOnly)} 
              className={`flex-row items-center px-3 py-1.5 rounded-full ${showDuplicatesOnly ? 'bg-red-500' : 'bg-bg-elevated border border-border-subtle'}`}
            >
              <Copy size={14} color={showDuplicatesOnly ? 'white' : colors.text.primary} />
              <Text className={`text-xs font-bold ml-1.5 ${showDuplicatesOnly ? 'text-white' : 'text-text-primary'}`}>
                {duplicates.length} {t('documents.duplicates')}
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Category Pills */}
      {!showDuplicatesOnly && (
        <View className="py-3 px-4 border-b border-border-subtle bg-bg-surface">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {categoryPills.map((pill) => {
              const isSelected = activeCategory === pill.id;
              return (
                <TouchableOpacity
                  key={pill.id}
                  onPress={() => setActiveCategory(pill.id)}
                  className={`px-4 py-2 rounded-full border ${isSelected ? 'bg-accent-primary border-accent-primary' : 'bg-bg-elevated border-border-subtle'}`}
                  activeOpacity={0.7}
                >
                  <Text className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-text-primary'}`}>
                    {pill.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Filter / Sort Control Bar */}
      <View className="flex-row items-center justify-between px-4 py-2 bg-bg-base border-b border-border-subtle">
        <Text className="text-text-secondary text-xs font-semibold">
          {showDuplicatesOnly 
            ? t('documents.reviewDuplicates', { count: documents.length }) 
            : t('documents.filesCount', { count: documents.length })}
        </Text>

        <View className="flex-row items-center gap-2">
          {/* Sort Button */}
          <TouchableOpacity 
            onPress={() => setShowSortModal(true)} 
            className="flex-row items-center px-3 py-1.5 bg-bg-elevated rounded-lg border border-border-subtle"
          >
            <ArrowDownUp size={14} color={colors.text.primary} />
            <Text className="text-text-primary text-xs font-medium ml-1.5 capitalize">
              {t('documents.sortBy', { type: sortBy })}
            </Text>
          </TouchableOpacity>

          {/* View Mode Toggle */}
          <TouchableOpacity 
            onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')} 
            className="p-1.5 bg-bg-elevated rounded-lg border border-border-subtle"
          >
            {viewMode === 'list' ? (
              <LayoutGrid size={16} color={colors.text.primary} />
            ) : (
              <List size={16} color={colors.text.primary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Document List */}
      <View className="flex-1">
        <FlatList
          key={viewMode}
          data={documents}
          numColumns={viewMode === 'grid' ? 2 : 1}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 12, paddingBottom: 80 }}
          ListEmptyComponent={
            <EmptyState
              title={showDuplicatesOnly ? t('documents.noDuplicates') : t('documents.noDocs', { category: activeCategory })}
              description={showDuplicatesOnly ? "Your storage is clean of duplicate files." : "Documents discovered on your device will appear here automatically."}
            />
          }
          renderItem={({ item }) => (
            <DocumentCard
              doc={item}
              title={item.title}
              subtitle={`${formatFileSize(item.file_size_bytes)} • ${new Date(item.imported_at).toLocaleDateString()}`}
              format={item.format}
              isFavorite={item.is_favorite === 1}
              onToggleFavorite={() => handleToggleFavorite(item.id)}
              onRefresh={loadData}
              onPress={() => router.push(`/reader/${item.id}`)}
              variant={viewMode}
            />
          )}
        />
        <FAB
          icon={FilePlus}
          label={t('common.addFiles')}
          onPress={() => router.push('/import')}
        />
      </View>

      {/* Sort Options Modal */}
      <Modal visible={showSortModal} transparent animationType="fade" onRequestClose={() => setShowSortModal(false)}>
        <TouchableOpacity className="flex-1 bg-black/50 justify-center items-center p-6" onPress={() => setShowSortModal(false)} activeOpacity={1}>
          <View className="bg-bg-surface w-full rounded-2xl p-5 border border-border-subtle" onStartShouldSetResponder={() => true}>
            <Text className="text-text-primary text-lg font-bold mb-4">{t('documents.sortTitle')}</Text>
            
            {[
              { id: 'date', label: t('documents.sortDate') },
              { id: 'name', label: t('documents.sortName') },
              { id: 'size', label: t('documents.sortSize') },
            ].map((option) => {
              const isSelected = sortBy === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => {
                    if (sortBy === option.id) {
                      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                    } else {
                      setSortBy(option.id as any);
                    }
                    setShowSortModal(false);
                  }}
                  className="flex-row items-center justify-between p-3.5 rounded-xl mb-1 bg-bg-elevated"
                >
                  <Text className={`text-base font-medium ${isSelected ? 'text-accent-primary font-bold' : 'text-text-primary'}`}>
                    {option.label} {isSelected ? `(${sortOrder.toUpperCase()})` : ''}
                  </Text>
                  {isSelected && <Check size={18} color={colors.accent.primary} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* AdMob Bottom Banner */}
      <AdBanner />
    </Screen>
  );
}
