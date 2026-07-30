import * as FileSystem from 'expo-file-system/legacy';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';
import { insertDocument } from '../db/documentsRepository';

const SAF_URI_KEY = '@saf_directory_uri';
const ALLOWED_EXTENSIONS = [
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 
  'txt', 'csv', 'rtf', 'odt', 'png', 'jpg', 'jpeg', 'webp', 'gif', 'heic'
];

export async function hasStoragePermission(): Promise<boolean> {
  const savedUri = await AsyncStorage.getItem(SAF_URI_KEY);
  return !!savedUri;
}

export async function requestAndScanDevice(onProgress: (count: number) => void): Promise<number> {
  return new Promise((resolve) => {
    Alert.alert(
      "Select a Folder to Scan",
      "Android privacy rules prevent selecting the main root folder. Please select a specific folder like 'Documents' or 'Download' on the next screen, then tap 'USE THIS FOLDER'.",
      [
        { text: "Cancel", style: "cancel", onPress: () => resolve(0) },
        {
          text: "Select Folder",
          onPress: async () => {
            try {
              const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
              if (permissions.granted) {
                await AsyncStorage.setItem(SAF_URI_KEY, permissions.directoryUri);
                const count = await scanSavedDirectory(onProgress);
                resolve(count);
                return;
              }
            } catch (err) {
              console.warn("SAF Error", err);
            }
            resolve(0);
          }
        }
      ]
    );
  });
}

export async function scanSavedDirectory(onProgress: (count: number) => void): Promise<number> {
  let foundCount = 0;
  try {
    const savedUri = await AsyncStorage.getItem(SAF_URI_KEY);
    if (!savedUri) return 0;
    
    async function traverse(uri: string, depth: number = 0) {
      if (depth > 5) return; // Prevent infinite loops
      try {
        const files = await FileSystem.StorageAccessFramework.readDirectoryAsync(uri);
        for (const fileUri of files) {
          try {
            const decoded = decodeURIComponent(fileUri);
            const filename = decoded.split('/').pop() || 'Unknown';
            const extParts = filename.split('.');
            const ext = extParts.length > 1 ? extParts[extParts.length - 1].toLowerCase() : '';
            
            if (ALLOWED_EXTENSIONS.includes(ext)) {
              foundCount++;
              if (foundCount % 10 === 0) onProgress(foundCount);
              
              await insertDocument({
                id: Crypto.randomUUID(),
                title: filename,
                filename: filename,
                format: ext,
                file_path: fileUri,
                content_uri: fileUri,
                file_hash: fileUri,
                file_size_bytes: 1024 * 1024, // Mock size for speed
                page_count: ext === 'pdf' ? 1 : null,
                thumbnail_path: null,
                imported_at: Date.now(),
                last_opened_at: null,
                last_read_page: 0,
                is_favorite: 0,
                folder_id: null
              });
            } else if (!ext || ext.length > 4) {
              // Might be a directory, try traversing it. If it's a file, it will safely throw and be ignored.
              await traverse(fileUri, depth + 1);
            }
          } catch (innerE) {
             // Ignore individual file errors
          }
        }
      } catch (e) {
         // Ignore if the URI is a file instead of a directory, or unreadable
      }
    }
    
    await traverse(savedUri);
    onProgress(foundCount);
    return foundCount;
  } catch (e) {
    console.error("Scan failed", e);
    return 0;
  }
}
