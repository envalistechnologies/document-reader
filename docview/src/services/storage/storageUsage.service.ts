import { getAllDocuments } from '../db/documentsRepository';

export interface StorageBreakdown {
  totalBytes: number;
  documentsBytes: number;
  thumbnailsBytes: number;
  cacheBytes: number;
  perDocument: { documentId: string; title: string; bytes: number; lastOpenedAt: number | null }[];
}

export async function getStorageBreakdown(): Promise<StorageBreakdown> {
  const documents = await getAllDocuments();
  
  let documentsBytes = 0;
  const perDocument = [];

  for (const doc of documents) {
    documentsBytes += doc.file_size_bytes;
    perDocument.push({
      documentId: doc.id,
      title: doc.title,
      bytes: doc.file_size_bytes,
      lastOpenedAt: doc.last_opened_at,
    });
  }

  // Sort perDocument by size descending
  perDocument.sort((a, b) => b.bytes - a.bytes);

  // For now, thumbnails and caches are placeholders
  const thumbnailsBytes = 0;
  const cacheBytes = 0;
  const totalBytes = documentsBytes + thumbnailsBytes + cacheBytes;

  return {
    totalBytes,
    documentsBytes,
    thumbnailsBytes,
    cacheBytes,
    perDocument,
  };
}
