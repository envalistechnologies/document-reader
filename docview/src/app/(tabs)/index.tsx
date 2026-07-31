import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, View, TouchableOpacity, Text, RefreshControl } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { AppBar } from '../../components/ui/AppBar/AppBar';
import { EmptyState } from '../../components/ui/EmptyState/EmptyState';
import { AdBanner } from '../../components/ui/AdBanner/AdBanner';
import { FAB } from '../../components/ui/FAB/FAB';
import { Search as SearchIcon, HardDrive, ArrowRight, ShieldCheck, FilePlus } from 'lucide-react-native';
import { DocumentCard } from '../../components/ui/DocumentCard/DocumentCard';
import { RemoveAdsCard } from '../../components/ui/RemoveAdsCard/RemoveAdsCard';
import { HomeCategoryGrid } from '../../components/ui/HomeCategoryGrid';
import { InlineTabs } from '../../components/ui/InlineTabs';
import { useTheme } from '../../theme/useTheme';
import { useFocusEffect, useRouter } from 'expo-router';
import { getFreeDiskStorageAsync, getTotalDiskCapacityAsync } from 'expo-file-system/legacy';
import { useTranslation } from 'react-i18next';

import { 
  getRecentDocuments, 
  getDocumentCountsByType, 
  toggleFavorite, 
  DocumentRecord,
  getLargestDocuments,
  getDuplicateDocuments
} from '../../services/db/documentsRepository';
import { scanSavedDirectory, hasStoragePermission } from '../../services/scanner/deviceScanner';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [counts, setCounts] = useState<Record<string, number>>({});
  const [storageInfo, setStorageInfo] = useState('...');
  const [activeTab, setActiveTab] = useState<'Recent' | 'Largest'>('Recent');
  const [recentDocs, setRecentDocs] = useState<DocumentRecord[]>([]);
  const [largestDocs, setLargestDocs] = useState<DocumentRecord[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadStorage = async () => {
    try {
      const free = await getFreeDiskStorageAsync();
      const total = await getTotalDiskCapacityAsync();
      const usedGB = ((total - free) / 1024 / 1024 / 1024).toFixed(1);
      const totalGB = (total / 1024 / 1024 / 1024).toFixed(1);
      setStorageInfo(`${usedGB} GB / ${totalGB} GB`);
    } catch (e) {
      setStorageInfo('Storage Info Unavailable');
    }
  };

  const loadData = async () => {
    try {
      const c = await getDocumentCountsByType();
      setCounts(c);
      
      const recent = await getRecentDocuments(10);
      setRecentDocs(recent);

      const largest = await getLargestDocuments(10);
      setLargestDocs(largest);
    } catch (e) {
      console.warn("DB not ready", e);
    }
  };

  const startAutoScan = async () => {
    try {
      const hasPerm = await hasStoragePermission();
      if (hasPerm) {
        await scanSavedDirectory(() => {});
        await loadData();
      }
    } catch (e) {
      console.warn("Auto-scan error", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      const init = async () => {
        await loadStorage();
        if (isMounted) await loadData();
        await startAutoScan();
      };
      init();
      return () => {
        isMounted = false;
      };
    }, [])
  );

  const handleToggleFavorite = async (docId: string) => {
    await toggleFavorite(docId);
    loadData();
  };

  const listData = activeTab === 'Recent' ? recentDocs : largestDocs;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await startAutoScan();
    await loadData();
    setIsRefreshing(false);
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
          <TouchableOpacity onPress={() => router.push('/search')} className="p-2 mr-1">
            <SearchIcon size={22} color={colors.text.primary} />
          </TouchableOpacity>
        }
      />

      <View className="flex-1">
        <FlatList
          ListHeaderComponent={
            <>
              {/* Header Positioning Banner */}
              <View className="mx-4 mt-3 mb-2 p-4 bg-accent-primary/10 rounded-2xl border border-accent-primary/20 flex-row items-center justify-between">
                <View className="flex-1 mr-2">
                  <Text className="text-accent-primary font-bold text-sm mb-1">
                    {t('home.bannerTitle')}
                  </Text>
                  <Text className="text-text-secondary text-xs leading-4">
                    {t('home.bannerDesc')}
                  </Text>
                </View>
                <ShieldCheck size={28} color={colors.accent.primary} />
              </View>

              {/* Storage & Quick Stat Header Widget */}
              <View className="mx-4 my-2 p-4 bg-bg-elevated rounded-2xl border border-border-subtle flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-xl bg-accent-primary/15 items-center justify-center mr-3">
                    <HardDrive size={22} color={colors.accent.primary} />
                  </View>
                  <View>
                    <Text className="text-text-primary font-bold text-sm">
                      {counts.all || 0} {t('home.totalDocuments')}
                    </Text>
                    <Text className="text-text-secondary text-xs mt-0.5">
                      {t('home.storage')}: {storageInfo}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity 
                  onPress={() => router.push('/documents')}
                  className="flex-row items-center bg-bg-surface px-3 py-2 rounded-xl border border-border-subtle"
                >
                  <Text className="text-text-primary text-xs font-bold mr-1">{t('home.browseAll')}</Text>
                  <ArrowRight size={14} color={colors.text.primary} />
                </TouchableOpacity>
              </View>

              {/* Category Grid Shortcuts */}
              <HomeCategoryGrid counts={counts} storageInfo={storageInfo} />

              {/* Quick Access Switch Tabs */}
              <InlineTabs 
                tabs={[t('home.recent'), t('home.largest')]}
                activeTab={activeTab === 'Recent' ? t('home.recent') : t('home.largest')}
                onTabChange={(tab) => setActiveTab(tab === t('home.recent') ? 'Recent' : 'Largest')}
              />
            </>
          }
          data={listData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 12, paddingBottom: 80, paddingTop: 4 }}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colors.accent.primary} />
          }
          ListEmptyComponent={
            <EmptyState
              title={t('home.noRecent')}
              description={t('home.pullRefresh')}
            />
          }
          renderItem={({ item }) => (
            <DocumentCard
              doc={item}
              title={item.title}
              subtitle={`${formatFileSize(item.file_size_bytes)} • ${item.format.toUpperCase()}`}
              format={item.format}
              isFavorite={item.is_favorite === 1}
              onToggleFavorite={() => handleToggleFavorite(item.id)}
              onRefresh={loadData}
              onPress={() => router.push(`/reader/${item.id}`)}
            />
          )}
        />
        <FAB
          icon={FilePlus}
          label={t('common.addFiles')}
          onPress={() => router.push('/import')}
        />
      </View>

      <RemoveAdsCard variant="compact" className="mx-4 mb-1" />
      <AdBanner />
    </Screen>
  );
}
