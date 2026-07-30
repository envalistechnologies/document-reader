import React, { useEffect, useState } from 'react';
import { FlatList, View, TouchableOpacity, Text, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { AppBar } from '../../components/ui/AppBar/AppBar';
import { EmptyState } from '../../components/ui/EmptyState/EmptyState';
import { DocumentCard } from '../../components/ui/DocumentCard/DocumentCard';
import { getDocumentsByFolder, toggleFavorite, DocumentRecord } from '../../services/db/documentsRepository';
import { getFolderById, FolderRecord } from '../../services/db/foldersRepository';
import { useFolders } from '../../features/library/hooks/useFolders';
import { MoveToFolderModal } from '../../features/library/components/MoveToFolderModal';

import { ChevronLeft, Search, X } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';

export default function FolderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  
  const [folder, setFolder] = useState<FolderRecord | null>(null);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { folders, moveDocument, refresh: refreshFolders } = useFolders();
  const [movingDocId, setMovingDocId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      if (id) {
        const folderData = await getFolderById(id);
        setFolder(folderData);
        
        const docs = await getDocumentsByFolder(id);
        setDocuments(docs);
      }
    } catch (e) {
      console.warn("Error loading folder data", e);
    }
  };

  useEffect(() => {
    loadData();
    refreshFolders();
  }, [id]);

  const handleMoveDocument = async (targetFolderId: string | null) => {
    if (movingDocId) {
      await moveDocument(movingDocId, targetFolderId);
      setMovingDocId(null);
      loadData();
      refreshFolders();
    }
  };

  const handleToggleFavorite = async (docId: string) => {
    await toggleFavorite(docId);
    loadData();
  };

  const filteredDocuments = documents.filter((doc) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return doc.title.toLowerCase().includes(q) || doc.format.toLowerCase().includes(q);
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
              placeholder={`Search in ${folder ? folder.name.toLowerCase() : 'folder'}...`}
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
          title={folder ? folder.name : 'Loading...'} 
          leadingSlot={
            <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
              <ChevronLeft size={24} color={colors.text.primary} />
            </TouchableOpacity>
          }
          trailingSlot={
            documents.length > 0 ? (
              <TouchableOpacity onPress={() => setIsSearching(true)} className="p-2">
                <Search size={22} color={colors.text.primary} />
              </TouchableOpacity>
            ) : undefined
          }
        />
      )}
      
      {filteredDocuments.length === 0 ? (
        <EmptyState
          useLogo={false}
          title={searchQuery ? "No matching documents" : "Folder is empty"}
          description={searchQuery ? "Try a different search query." : "Documents you move to this folder will appear here."}
        />
      ) : (
        <FlatList
          data={filteredDocuments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          renderItem={({ item }) => (
            <DocumentCard
              title={item.title}
              subtitle={`${formatFileSize(item.file_size_bytes)} • Imported ${new Date(item.imported_at).toLocaleDateString()}`}
              format={item.format}
              isFavorite={item.is_favorite === 1}
              onToggleFavorite={() => handleToggleFavorite(item.id)}
              onPress={() => router.push(`/reader/${item.id}`)}
              onMove={() => setMovingDocId(item.id)}
            />
          )}
        />
      )}

      <MoveToFolderModal
        visible={movingDocId !== null}
        folders={folders}
        currentFolderId={id || null}
        onClose={() => setMovingDocId(null)}
        onSelectFolder={handleMoveDocument}
      />
    </Screen>
  );
}

