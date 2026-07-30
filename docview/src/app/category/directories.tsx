import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { AppBar } from '../../components/ui/AppBar/AppBar';
import { ChevronLeft, Folder } from 'lucide-react-native';
import { EmptyState } from '../../components/ui/EmptyState/EmptyState';
import { useTheme } from '../../theme/useTheme';
import { getDirectoriesWithCount } from '../../services/db/documentsRepository';

export default function DirectoriesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  
  const [directories, setDirectories] = useState<{ folder: string; count: number }[]>([]);

  useEffect(() => {
    const load = async () => {
      const dirs = await getDirectoriesWithCount();
      setDirectories(dirs);
    };
    load();
  }, []);

  return (
    <Screen>
      <AppBar 
        title="Directories"
        leadingSlot={
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <ChevronLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
        }
      />
      
      <FlatList
        data={directories}
        keyExtractor={(item) => item.folder}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <EmptyState
            title="No directories found"
            description="Scan your device to find folders containing documents."
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => router.push(`/category/folder?folderName=${encodeURIComponent(item.folder)}`)}
            className="flex-row items-center p-4 bg-[#1a1b1e] rounded-xl mb-3"
          >
            <View className="w-12 h-12 rounded-xl bg-[#2a2b2e] items-center justify-center mr-4">
              <Folder size={24} color={colors.accent.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-base mb-1" numberOfLines={1}>
                {item.folder}
              </Text>
              <Text className="text-gray-400 text-sm">
                {item.count} items
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}
