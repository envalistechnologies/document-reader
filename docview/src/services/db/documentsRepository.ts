import { getDatabase } from './database';
import * as Crypto from 'expo-crypto';

export interface DocumentRecord {
  id: string;
  title: string;
  filename: string;
  format: string;
  file_path: string | null;
  file_hash: string;
  file_size_bytes: number;
  page_count: number | null;
  thumbnail_path: string | null;
  imported_at: number;
  last_opened_at: number | null;
  last_read_page: number;
  is_favorite: number;
  folder_id: string | null;
  content_uri?: string | null;
}

export async function insertDocument(doc: DocumentRecord): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT OR IGNORE INTO documents (
      id, title, filename, format, file_path, file_hash, file_size_bytes, 
      page_count, thumbnail_path, imported_at, last_opened_at, last_read_page, 
      is_favorite, folder_id, content_uri
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      doc.id, doc.title, doc.filename, doc.format, doc.file_path ?? null, doc.file_hash,
      doc.file_size_bytes, doc.page_count, doc.thumbnail_path, doc.imported_at,
      doc.last_opened_at, doc.last_read_page, doc.is_favorite, doc.folder_id,
      doc.content_uri ?? null
    ]
  );
}

export async function getDocumentByHash(hash: string): Promise<DocumentRecord | null> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<DocumentRecord>(
    `SELECT * FROM documents WHERE file_hash = ?`, 
    [hash]
  );
  return result;
}

export async function getAllDocuments(): Promise<DocumentRecord[]> {
  const db = await getDatabase();
  return await db.getAllAsync<DocumentRecord>(`SELECT * FROM documents ORDER BY imported_at DESC`);
}

export async function getDocumentsByFolder(folderId: string | null): Promise<DocumentRecord[]> {
  const db = await getDatabase();
  if (folderId === null) {
    return await db.getAllAsync<DocumentRecord>(
      `SELECT * FROM documents WHERE folder_id IS NULL ORDER BY imported_at DESC`
    );
  }
  return await db.getAllAsync<DocumentRecord>(
    `SELECT * FROM documents WHERE folder_id = ? ORDER BY imported_at DESC`,
    [folderId]
  );
}

export async function updateDocumentFolder(docId: string, folderId: string | null): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(`UPDATE documents SET folder_id = ? WHERE id = ?`, [folderId, docId]);
}

export async function getDocumentById(docId: string): Promise<DocumentRecord | null> {
  const db = await getDatabase();
  return await db.getFirstAsync<DocumentRecord>(
    `SELECT * FROM documents WHERE id = ?`,
    [docId]
  );
}

export async function searchDocuments(query: string): Promise<DocumentRecord[]> {
  const db = await getDatabase();
  const pattern = `%${query}%`;
  return await db.getAllAsync<DocumentRecord>(
    `SELECT * FROM documents WHERE title LIKE ? OR filename LIKE ? ORDER BY imported_at DESC`,
    [pattern, pattern]
  );
}

export async function getFavoriteDocuments(): Promise<DocumentRecord[]> {
  const db = await getDatabase();
  return await db.getAllAsync<DocumentRecord>(
    `SELECT * FROM documents WHERE is_favorite = 1 ORDER BY last_opened_at DESC, imported_at DESC`
  );
}

export async function toggleFavorite(docId: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE documents SET is_favorite = CASE WHEN is_favorite = 1 THEN 0 ELSE 1 END WHERE id = ?`,
    [docId]
  );
}

export async function updateLastOpenedAt(docId: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE documents SET last_opened_at = ? WHERE id = ?`,
    [Date.now(), docId]
  );
}

export async function deleteDocument(docId: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `DELETE FROM documents WHERE id = ?`,
    [docId]
  );
}

export async function clearAllDocuments(): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(`DELETE FROM documents`);
}

export async function getDirectoriesWithCount(): Promise<{ folder: string; count: number }[]> {
  const db = await getDatabase();
  return await db.getAllAsync<{ folder: string; count: number }>(
    `SELECT folder_id as folder, COUNT(*) as count FROM documents WHERE folder_id IS NOT NULL GROUP BY folder_id`
  );
}

export async function getDocumentsByDirectory(folderName: string): Promise<DocumentRecord[]> {
  const db = await getDatabase();
  return await db.getAllAsync<DocumentRecord>(
    `SELECT * FROM documents WHERE folder_id = ? ORDER BY imported_at DESC`,
    [folderName]
  );
}

export async function getDocumentCount(): Promise<number> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM documents`);
  return result?.count || 0;
}



export async function getDocumentCountsByType(): Promise<Record<string, number>> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ format: string; count: number }>(
    `SELECT format, COUNT(*) as count FROM documents GROUP BY format`
  );
  
  const counts: Record<string, number> = {
    all: 0,
    pdf: 0,
    word: 0,
    excel: 0,
    ppt: 0,
    txt: 0,
    image: 0
  };
  
  for (const row of rows) {
    const format = row.format.toLowerCase();
    counts.all += row.count;
    
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(format)) {
      counts.image += row.count;
    } else if (['doc', 'docx'].includes(format)) {
      counts.word += row.count;
    } else if (['xls', 'xlsx'].includes(format)) {
      counts.excel += row.count;
    } else if (['ppt', 'pptx'].includes(format)) {
      counts.ppt += row.count;
    } else if (format === 'pdf') {
      counts.pdf += row.count;
    } else if (format === 'txt') {
      counts.txt += row.count;
    }
  }
  return counts;
}

export async function getRecentDocuments(limit: number = 10): Promise<DocumentRecord[]> {
  const db = await getDatabase();
  return await db.getAllAsync<DocumentRecord>(
    `SELECT * FROM documents ORDER BY imported_at DESC LIMIT ?`,
    [limit]
  );
}

export async function getDocumentsByFormat(formatCategory: string): Promise<DocumentRecord[]> {
  const db = await getDatabase();
  if (formatCategory === 'all') {
    return await db.getAllAsync<DocumentRecord>(`SELECT * FROM documents ORDER BY imported_at DESC`);
  } else if (formatCategory === 'image') {
    return await db.getAllAsync<DocumentRecord>(
      `SELECT * FROM documents WHERE format IN ('jpg', 'jpeg', 'png', 'webp', 'gif', 'heic') ORDER BY imported_at DESC`
    );
  } else if (formatCategory === 'word') {
    return await db.getAllAsync<DocumentRecord>(
      `SELECT * FROM documents WHERE format IN ('doc', 'docx', 'odt', 'rtf') ORDER BY imported_at DESC`
    );
  } else if (formatCategory === 'excel') {
    return await db.getAllAsync<DocumentRecord>(
      `SELECT * FROM documents WHERE format IN ('xls', 'xlsx', 'csv') ORDER BY imported_at DESC`
    );
  } else if (formatCategory === 'ppt') {
    return await db.getAllAsync<DocumentRecord>(
      `SELECT * FROM documents WHERE format IN ('ppt', 'pptx') ORDER BY imported_at DESC`
    );
  }
  
  return await db.getAllAsync<DocumentRecord>(
    `SELECT * FROM documents WHERE format = ? ORDER BY imported_at DESC`,
    [formatCategory]
  );
}

export async function renameDocument(docId: string, newTitle: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(`UPDATE documents SET title = ? WHERE id = ?`, [newTitle, docId]);
}

export async function getLargestDocuments(limit: number = 10): Promise<DocumentRecord[]> {
  const db = await getDatabase();
  return await db.getAllAsync<DocumentRecord>(
    `SELECT * FROM documents ORDER BY file_size_bytes DESC LIMIT ?`,
    [limit]
  );
}

export async function getDuplicateDocuments(): Promise<DocumentRecord[]> {
  const db = await getDatabase();
  // Find documents that share the same filename or size & format
  return await db.getAllAsync<DocumentRecord>(
    `SELECT * FROM documents WHERE filename IN (
      SELECT filename FROM documents GROUP BY filename HAVING COUNT(*) > 1
    ) ORDER BY filename ASC, imported_at DESC`
  );
}

export async function getDocumentsSorted(
  formatCategory: string,
  sortBy: 'name' | 'date' | 'size' | 'recent' = 'date',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<DocumentRecord[]> {
  const db = await getDatabase();
  let whereClause = '';
  let params: any[] = [];

  if (formatCategory === 'image') {
    whereClause = `WHERE format IN ('jpg', 'jpeg', 'png', 'webp', 'gif', 'heic')`;
  } else if (formatCategory === 'word') {
    whereClause = `WHERE format IN ('doc', 'docx', 'odt', 'rtf')`;
  } else if (formatCategory === 'excel') {
    whereClause = `WHERE format IN ('xls', 'xlsx', 'csv')`;
  } else if (formatCategory === 'ppt') {
    whereClause = `WHERE format IN ('ppt', 'pptx')`;
  } else if (formatCategory !== 'all' && formatCategory !== '') {
    whereClause = `WHERE format = ?`;
    params.push(formatCategory);
  }

  let orderBy = 'imported_at DESC';
  if (sortBy === 'name') {
    orderBy = `title ${sortOrder.toUpperCase()}`;
  } else if (sortBy === 'date') {
    orderBy = `imported_at ${sortOrder.toUpperCase()}`;
  } else if (sortBy === 'size') {
    orderBy = `file_size_bytes ${sortOrder.toUpperCase()}`;
  } else if (sortBy === 'recent') {
    orderBy = `last_opened_at DESC, imported_at DESC`;
  }

  return await db.getAllAsync<DocumentRecord>(
    `SELECT * FROM documents ${whereClause} ORDER BY ${orderBy}`,
    params
  );
}



