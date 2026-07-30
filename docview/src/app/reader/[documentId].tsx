import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { Screen } from '../../components/layout/Screen';
import { AppBar } from '../../components/ui/AppBar/AppBar';
import * as FileSystem from 'expo-file-system/legacy';
import { getDocumentById, updateLastOpenedAt, DocumentRecord } from '../../services/db/documentsRepository';
import { Ellipsis, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';

import { TextEditorViewer } from '../../components/ui/TextViewer/TextEditorViewer';
import { ImageViewer } from '../../components/ui/ImageViewer/ImageViewer';
import { WordViewerEngine } from '../../components/ui/ViewerEngines/WordViewerEngine';
import { ExcelViewerEngine } from '../../components/ui/ViewerEngines/ExcelViewerEngine';
import { PptViewerEngine } from '../../components/ui/ViewerEngines/PptViewerEngine';
import { UniversalWebViewer } from '../../components/ui/UniversalWebViewer/UniversalWebViewer';

import { useInterstitialAd, isAdMobAvailable } from '../../services/ads/admobWrapper';
import { ADMOB_CONFIG } from '../../config/ads';

import { useSettingsStore } from '../../store/useSettingsStore';

const TEXT_FORMATS = ['txt', 'md', 'json', 'log'];
const IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic'];
const WORD_FORMATS = ['doc', 'docx', 'odt', 'rtf'];
const EXCEL_FORMATS = ['xls', 'xlsx', 'csv', 'ods'];
const PPT_FORMATS = ['ppt', 'pptx', 'odp'];

export default function DocumentReaderScreen() {
  const { documentId } = useLocalSearchParams<{ documentId: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const adFreeUntil = useSettingsStore((state) => state.adFreeUntil);
  const isAdFree = adFreeUntil !== null && Date.now() < adFreeUntil;

  const [document, setDocument] = useState<DocumentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isLoaded, load, show } = useInterstitialAd(ADMOB_CONFIG.interstitialDocOpen, {
    requestNonPersonalizedAdsOnly: false,
  });

  useEffect(() => {
    if (Platform.OS !== 'web' && isAdMobAvailable && !isAdFree) {
      load();
    }
  }, [load, isAdFree]);

  useEffect(() => {
    if (isLoaded && Platform.OS !== 'web' && isAdMobAvailable && !isAdFree) {
      show();
    }
  }, [isLoaded, show, isAdFree]);

  useEffect(() => {
    async function loadDocument() {
      try {
        if (!documentId) return;
        const doc = await getDocumentById(documentId);
        if (doc) {
          if (doc.content_uri) {
            try {
              const info = await FileSystem.getInfoAsync(doc.content_uri);
              if (!info.exists) {
                setError('This file is no longer available — it may have been moved or deleted.');
                return;
              }
            } catch (_) {}
          }

          setDocument(doc);
          await updateLastOpenedAt(doc.id);
        } else {
          setError('Document not found');
        }
      } catch (err) {
        console.error('Failed to load document', err);
        setError('Failed to load document details');
      } finally {
        setLoading(false);
      }
    }

    loadDocument();
  }, [documentId]);

  if (loading) {
    return (
      <Screen isReader>
        <AppBar leadingSlot={<BackButton />} title="Loading..." />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.accent.primary} />
        </View>
      </Screen>
    );
  }

  if (error || !document) {
    return (
      <Screen isReader>
        <AppBar leadingSlot={<BackButton />} title="Error" />
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-text-primary text-lg text-center">{error || 'Unknown error'}</Text>
        </View>
      </Screen>
    );
  }

  const fmt = document.format.toLowerCase();
  const isText = TEXT_FORMATS.includes(fmt);
  const isImage = IMAGE_FORMATS.includes(fmt);
  const isWord = WORD_FORMATS.includes(fmt);
  const isExcel = EXCEL_FORMATS.includes(fmt);
  const isPpt = PPT_FORMATS.includes(fmt);

  const targetUri = document.content_uri || document.file_path || '';

  return (
    <Screen isReader>
      <AppBar 
        title={document.title} 
        leadingSlot={<BackButton />}
        trailingSlot={
          <TouchableOpacity onPress={() => router.push(`/document-info/${document.id}`)} className="p-2">
            <Ellipsis color={colors.text.secondary} size={20} />
          </TouchableOpacity>
        }
      />
      
      {isText ? (
        <TextEditorViewer filePath={targetUri} />
      ) : isImage ? (
        <ImageViewer filePath={targetUri} />
      ) : isWord ? (
        <WordViewerEngine filePath={targetUri} format={document.format} />
      ) : isExcel ? (
        <ExcelViewerEngine filePath={targetUri} format={document.format} />
      ) : isPpt ? (
        <PptViewerEngine filePath={targetUri} format={document.format} />
      ) : Platform.OS === 'ios' ? (
        <WebView 
          source={{ uri: targetUri }}
          style={{ flex: 1 }}
          originWhitelist={['*']}
          allowFileAccess={true}
          allowFileAccessFromFileURLs={true}
          allowUniversalAccessFromFileURLs={true}
        />
      ) : (
        <UniversalWebViewer filePath={targetUri} format={document.format} />
      )}
    </Screen>
  );
}

function BackButton() {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={() => router.back()} className="p-2">
      <ChevronLeft size={24} color={colors.text.primary} />
    </TouchableOpacity>
  );
}
