import * as Sharing from 'expo-sharing';
import { DocumentRecord } from '../db/documentsRepository';

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

export async function shareDocument(document: DocumentRecord): Promise<void> {
  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) {
    throw new Error('Sharing is not available on this device');
  }

  const mimeType = MIME_TYPES[document.format.toLowerCase()] || '*/*';

  const fileUri = document.content_uri || document.file_path;
  if (!fileUri) {
    throw new Error('No file path or content URI available for this document');
  }

  await Sharing.shareAsync(fileUri, {
    mimeType: mimeType,
    dialogTitle: document.title,
  });
}
