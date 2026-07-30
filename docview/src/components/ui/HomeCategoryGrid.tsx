import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FileTypeIcon } from './FileTypeIcon';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

interface CategoryItem {
  id: string;
  labelKey: string;
  type: string; // Used for icon
  countText: string;
  route: string;
}

interface HomeCategoryGridProps {
  counts: Record<string, number>;
  storageInfo: string;
}

export function HomeCategoryGrid({ counts, storageInfo }: HomeCategoryGridProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const categories: CategoryItem[] = [
    { id: 'all', labelKey: 'common.all', type: 'all', countText: `${counts.all || 0}`, route: '/category/all' },
    { id: 'pdf', labelKey: 'common.pdf', type: 'pdf', countText: `${counts.pdf || 0}`, route: '/category/pdf' },
    { id: 'word', labelKey: 'common.word', type: 'word', countText: `${counts.word || 0}`, route: '/category/word' },
    { id: 'excel', labelKey: 'common.excel', type: 'excel', countText: `${counts.excel || 0}`, route: '/category/excel' },
    { id: 'ppt', labelKey: 'common.ppt', type: 'ppt', countText: `${counts.ppt || 0}`, route: '/category/ppt' },
    { id: 'txt', labelKey: 'common.txt', type: 'txt', countText: `${counts.txt || 0}`, route: '/category/txt' },
    { id: 'image', labelKey: 'common.image', type: 'image', countText: `${counts.image || 0}`, route: '/category/image' },
  ];

  return (
    <View className="flex-row flex-wrap justify-between px-4 py-6 bg-bg-screen border-b border-border-subtle">
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          onPress={() => router.push(cat.route as any)}
          className="w-1/4 items-center mb-6"
          activeOpacity={0.7}
        >
          <FileTypeIcon type={cat.type} size="lg" className="mb-2" />
          <Text className="text-text-primary font-semibold text-sm mb-1">{t(cat.labelKey)}</Text>
          <Text className="text-text-secondary text-[10px]" numberOfLines={1}>
            {cat.countText} {t('documents.filesCount', { count: '' }).trim()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
