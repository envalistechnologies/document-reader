import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, TextInput, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { AppBar } from '../../components/ui/AppBar/AppBar';
import { Search, X, ArrowDownUp, ChevronLeft, Check } from 'lucide-react-native';
import { DocumentCard } from '../../components/ui/DocumentCard/DocumentCard';
import { EmptyState } from '../../components/ui/EmptyState/EmptyState';
import { useTheme } from '../../theme/useTheme';

import { 
  getDocumentsByFormat, 
  getAllDocuments,
  toggleFavorite, 
  DocumentRecord,
  getDocumentsByDirectory
} from '../../services/db/documentsRepository';

import { useTranslation } from 'react-i18next';

export default function CategoryScreen() {
  const { type, folderName } = useLocalSearchParams<{ type: string; folderName?: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [showSortModal, setShowSortModal] = useState(false);

  const getTitle = () => {
    if (type === 'all') return t('category.allFiles');
    if (type === 'folder' && folderName) return folderName;
    if (type === 'pdf') return t('category.pdfFiles');
    if (type === 'word') return t('category.wordFiles');
    if (type === 'excel') return t('category.excelFiles');
    if (type === 'ppt') return t('category.pptFiles');
    if (type === 'txt') return t('category.txtFiles');
    if (type === 'image') return t('category.imageFiles');
    return t('common.documents');
  };

  const loadData = async () => {
    try {
      if (type === 'all') {
        const docs = await getAllDocuments();
        setDocuments(docs);
      } else if (type === 'folder' && folderName) {
        const docs = await getDocumentsByDirectory(folderName);
        setDocuments(docs);
      } else {
        const docs = await getDocumentsByFormat(type || 'all');
        setDocuments(docs);
      }
    } catch (e) {
      console.warn("DB not ready", e);
    }
  };

  useEffect(() => {
    loadData();
  }, [type, folderName]);

  const handleToggleFavorite = async (docId: string) => {
    await toggleFavorite(docId);
    loadData();
  };

  // Apply search filter
  const filteredDocuments = documents.filter((doc) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.format.toLowerCase().includes(q)
    );
  });

  // Apply sorting
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'name') {
      cmp = a.title.localeCompare(b.title);
    } else if (sortBy === 'size') {
      cmp = a.file_size_bytes - b.file_size_bytes;
    } else {
      cmp = new Date(a.imported_at).getTime() - new Date(b.imported_at).getTime();
    }
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Screen>
      {isSearching ? (
        <View className="h-14 flex-row items-center px-3 bg-bg-base border-b border-border-subtle gap-2">
          <TouchableOpacity onPress={() => setIsSearching(false)} className="p-2 -ml-1">
            <ChevronLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <View className="flex-1 flex-row items-center bg-bg-elevated rounded-xl border border-border-subtle px-3 py-1.5">
            <Search size={18} color={colors.text.secondary} />
            <TextInput
              autoFocus
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={`Search in ${getTitle().toLowerCase()}...`}
              placeholderTextColor={colors.text.secondary}
              style={{ flex: 1, color: colors.text.primary, fontSize: 14, marginLeft: 8, paddingVertical: 2 }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} className="p-1">
                <X size={16} color={colors.text.secondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <AppBar 
          title={getTitle()} 
          leadingSlot={
            <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
              <ChevronLeft size={24} color={colors.text.primary} />
            </TouchableOpacity>
          }
          trailingSlot={
            <View className="flex-row items-center space-x-4 gap-4 pr-2">
              <TouchableOpacity onPress={() => setIsSearching(true)}>
                <Search size={22} color={colors.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowSortModal(true)}>
                <ArrowDownUp size={22} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* Info Bar */}
      <View className="flex-row items-center justify-between px-4 py-2 bg-bg-base border-b border-border-subtle">
        <Text className="text-text-secondary text-xs font-semibold">
          {searchQuery ? `${sortedDocuments.length} result${sortedDocuments.length !== 1 ? 's' : ''}` : `${sortedDocuments.length} Files`}
        </Text>
        <Text className="text-text-secondary text-xs capitalize">
          Sort: {sortBy} ({sortOrder.toUpperCase()})
        </Text>
      </View>
      
      <FlatList
        data={sortedDocuments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListEmptyComponent={
          <EmptyState
            title={searchQuery ? 'No matching files' : `No ${getTitle().toLowerCase()} found`}
            description={searchQuery ? 'Try a different search term.' : 'Import some files to see them here.'}
          />
        }
        renderItem={({ item }) => (
          <DocumentCard
            title={item.title}
            subtitle={`${formatFileSize(item.file_size_bytes)} • ${new Date(item.imported_at).toLocaleDateString()}`}
            format={item.format}
            isFavorite={item.is_favorite === 1}
            onToggleFavorite={() => handleToggleFavorite(item.id)}
            onPress={() => router.push(`/reader/${item.id}`)}
          />
        )}
      />

      {/* Sort Options Modal */}
      <Modal visible={showSortModal} transparent animationType="fade" onRequestClose={() => setShowSortModal(false)}>
        <TouchableOpacity className="flex-1 bg-black/50 justify-center items-center p-6" onPress={() => setShowSortModal(false)} activeOpacity={1}>
          <View className="bg-bg-surface w-full rounded-2xl p-5 border border-border-subtle" onStartShouldSetResponder={() => true}>
            <Text className="text-text-primary text-lg font-bold mb-4">Sort Files By</Text>
            
            {[
              { id: 'date', label: 'Date Added' },
              { id: 'name', label: 'Name (A-Z)' },
              { id: 'size', label: 'File Size' },
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
    </Screen>
  );
}
