import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../components/layout/Screen';
import { AppBar } from '../components/ui/AppBar/AppBar';
import { FilePlus, FolderSearch, RefreshCw, CheckCircle2, ChevronLeft, Shield } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { importDocumentsFromPicker } from '../services/scanner/documentImportService';
import { requestAndScanDevice, scanSavedDirectory, hasStoragePermission } from '../services/scanner/deviceScanner';

export default function ImportScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handlePickFiles = async () => {
    setLoading(true);
    setStatusMsg('Opening Document Picker...');
    try {
      const count = await importDocumentsFromPicker();
      if (count > 0) {
        Alert.alert('Import Successful', `Successfully added ${count} document(s) to your manager.`, [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to import documents.');
    } finally {
      setLoading(false);
      setStatusMsg(null);
    }
  };

  const handleScanFolder = async () => {
    setLoading(true);
    setStatusMsg('Preparing folder scan...');
    try {
      const count = await requestAndScanDevice(() => {});
      if (count > 0) {
        Alert.alert('Scan Complete', `Discovered ${count} document(s) on your device.`, [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (e) {
      Alert.alert('Error', 'Folder scan failed.');
    } finally {
      setLoading(false);
      setStatusMsg(null);
    }
  };

  const handleRescanSaved = async () => {
    setLoading(true);
    setStatusMsg('Scanning saved folder...');
    try {
      const hasPerm = await hasStoragePermission();
      if (hasPerm) {
        const count = await scanSavedDirectory(() => {});
        Alert.alert('Rescan Complete', `Found ${count} file(s) in saved directory.`, [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        await handleScanFolder();
      }
    } catch (e) {
      Alert.alert('Error', 'Rescan failed.');
    } finally {
      setLoading(false);
      setStatusMsg(null);
    }
  };

  return (
    <Screen>
      <AppBar 
        title="Discover & Import Documents" 
        leadingSlot={
          <TouchableOpacity onPress={() => router.back()} className="p-2 ml-1">
            <ChevronLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Banner */}
        <View className="p-5 bg-accent-primary/10 rounded-2xl mb-6 border border-accent-primary/20 flex-row items-center">
          <View className="w-12 h-12 rounded-xl bg-accent-primary/20 items-center justify-center mr-4">
            <Shield size={24} color={colors.accent.primary} />
          </View>
          <View className="flex-1">
            <Text className="text-accent-primary font-bold text-base mb-1">Document Discovery</Text>
            <Text className="text-text-secondary text-xs leading-4">
              Add files directly via System Picker or scan device folders to manage them all in one place.
            </Text>
          </View>
        </View>

        {loading ? (
          <View className="items-center justify-center py-16">
            <ActivityIndicator size="large" color={colors.accent.primary} />
            <Text className="text-text-primary font-bold text-lg mt-4">{statusMsg || 'Processing...'}</Text>
          </View>
        ) : (
          <View className="space-y-4">
            {/* Option 1: File Picker */}
            <TouchableOpacity
              onPress={handlePickFiles}
              className="p-5 bg-bg-elevated rounded-2xl border border-border-subtle flex-row items-center mb-3"
              activeOpacity={0.7}
            >
              <View className="w-12 h-12 rounded-2xl bg-blue-500/15 items-center justify-center mr-4">
                <FilePlus size={24} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-text-primary font-bold text-base mb-1">Pick / Select Files</Text>
                <Text className="text-text-secondary text-xs">
                  Select PDFs, Word, Excel, PPT, or images directly from system storage.
                </Text>
              </View>
            </TouchableOpacity>

            {/* Option 2: Folder Scan */}
            <TouchableOpacity
              onPress={handleScanFolder}
              className="p-5 bg-bg-elevated rounded-2xl border border-border-subtle flex-row items-center mb-3"
              activeOpacity={0.7}
            >
              <View className="w-12 h-12 rounded-2xl bg-emerald-500/15 items-center justify-center mr-4">
                <FolderSearch size={24} color="#10B981" />
              </View>
              <View className="flex-1">
                <Text className="text-text-primary font-bold text-base mb-1">Scan Specific Folder</Text>
                <Text className="text-text-secondary text-xs">
                  Grant access to a folder (like Documents or Download) to auto-index everything.
                </Text>
              </View>
            </TouchableOpacity>

            {/* Option 3: Rescan Saved Directory */}
            <TouchableOpacity
              onPress={handleRescanSaved}
              className="p-5 bg-bg-elevated rounded-2xl border border-border-subtle flex-row items-center"
              activeOpacity={0.7}
            >
              <View className="w-12 h-12 rounded-2xl bg-purple-500/15 items-center justify-center mr-4">
                <RefreshCw size={24} color="#8B5CF6" />
              </View>
              <View className="flex-1">
                <Text className="text-text-primary font-bold text-base mb-1">Rescan Saved Storage</Text>
                <Text className="text-text-secondary text-xs">
                  Re-check previously granted directories for newly added files.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
