import * as DocumentPicker from 'expo-document-picker';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system/legacy';
import { insertDocument, DocumentRecord } from '../db/documentsRepository';

export async function importDocumentsFromPicker(): Promise<number> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'text/csv',
        'application/rtf',
        'image/*',
        '*/*'
      ],
      multiple: true,
      copyToCacheDirectory: false, // Set false so asset.uri is content:// URI with full ContentResolver permissions
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return 0;
    }

    let addedCount = 0;

    for (const asset of result.assets) {
      try {
        const filename = asset.name || 'Untitled Document';
        const extParts = filename.split('.');
        const ext = extParts.length > 1 ? extParts[extParts.length - 1].toLowerCase() : 'pdf';
        const docId = Crypto.randomUUID();

        // Target path in permanent app documentDirectory
        const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
        const permanentUri = `${FileSystem.documentDirectory}${docId}_${safeFilename}`;
        
        let fileCopied = false;
        
        // 1. Try copyAsync from content:// URI
        try {
          await FileSystem.copyAsync({
            from: asset.uri,
            to: permanentUri
          });
          fileCopied = true;
        } catch (copyErr) {
          console.warn('copyAsync failed, trying base64 write fallback:', copyErr);
          // 2. Fallback: read string & write string to documentDirectory
          try {
            const base64 = await FileSystem.readAsStringAsync(asset.uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            await FileSystem.writeAsStringAsync(permanentUri, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });
            fileCopied = true;
          } catch (writeErr) {
            console.warn('base64 fallback write failed:', writeErr);
          }
        }

        const finalUri = fileCopied ? permanentUri : asset.uri;

        let fileSize = asset.size || 0;
        if (!fileSize) {
          try {
            const info = await FileSystem.getInfoAsync(finalUri);
            if (info.exists && 'size' in info) {
              fileSize = (info as any).size || 1024 * 1024;
            }
          } catch (_) {}
        }

        const doc: DocumentRecord = {
          id: docId,
          title: filename.replace(/\.[^/.]+$/, ''),
          filename: filename,
          format: ext,
          file_path: finalUri,
          content_uri: finalUri,
          file_hash: finalUri,
          file_size_bytes: fileSize || 1024 * 1024,
          page_count: ext === 'pdf' ? 1 : null,
          thumbnail_path: null,
          imported_at: Date.now(),
          last_opened_at: null,
          last_read_page: 0,
          is_favorite: 0,
          folder_id: null,
        };

        await insertDocument(doc);
        addedCount++;
      } catch (err) {
        console.warn('Failed to register picked document:', err);
      }
    }

    return addedCount;
  } catch (err) {
    console.error('Error in Document Picker:', err);
    return 0;
  }
}
