import * as IntentLauncher from 'expo-intent-launcher';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

const MIME_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  txt: 'text/plain',
  rtf: 'application/rtf',
  csv: 'text/csv',
};

export async function openFileInAndroid(fileUri: string, format: string) {
  if (Platform.OS !== 'android') return;

  const mimeType = MIME_TYPES[format.toLowerCase()] || '*/*';

  try {
    // If the URI is a local file path, we need to ensure it has content:// scheme for intents in newer Android versions
    // `expo-intent-launcher` supports `content://` URIs natively.
    // Wait, expo-file-system `getContentUriAsync` creates a content URI suitable for intents.
    const contentUri = await FileSystem.getContentUriAsync(fileUri);
    
    await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
      data: contentUri,
      flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
      type: mimeType,
    });
  } catch (error) {
    console.error('Error opening file intent:', error);
    throw error;
  }
}
