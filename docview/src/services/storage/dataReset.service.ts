import { getDatabase } from '../db/database';
import * as FileSystem from 'expo-file-system/legacy';

export async function deleteAllData(): Promise<void> {
  const db = await getDatabase();
  
  // 1. Drop/recreate tables to ensure completely clean state
  await db.execAsync(`
    PRAGMA foreign_keys = OFF;
    DROP TABLE IF EXISTS documents;
    DROP TABLE IF EXISTS folders;
    DROP TABLE IF EXISTS scanned_documents;
    DROP TABLE IF EXISTS saf_granted_folders;
    
    CREATE TABLE folders (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE documents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      filename TEXT NOT NULL,
      format TEXT NOT NULL,
      file_path TEXT,
      file_hash TEXT NOT NULL UNIQUE,
      file_size_bytes INTEGER NOT NULL,
      page_count INTEGER,
      thumbnail_path TEXT,
      imported_at INTEGER NOT NULL,
      last_opened_at INTEGER,
      last_read_page INTEGER NOT NULL DEFAULT 1,
      is_favorite INTEGER NOT NULL DEFAULT 0,
      folder_id TEXT,
      content_uri TEXT,
      FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL
    );

    CREATE TABLE scanned_documents (
      id TEXT PRIMARY KEY,
      content_uri TEXT NOT NULL,
      display_name TEXT NOT NULL,
      format TEXT NOT NULL,
      size_bytes INTEGER,
      discovered_via TEXT NOT NULL,
      source_folder_uri TEXT,
      last_verified_at INTEGER NOT NULL,
      added_to_library INTEGER DEFAULT 0
    );

    CREATE TABLE saf_granted_folders (
      uri TEXT PRIMARY KEY,
      display_name TEXT NOT NULL,
      granted_at INTEGER NOT NULL
    );

    PRAGMA foreign_keys = ON;
  `);

  // 2. Delete the actual files from the app's document directory
  const docsDir = FileSystem.documentDirectory + 'documents/';
  const thumbnailsDir = FileSystem.documentDirectory + 'thumbnails/';
  
  try {
    const docsInfo = await FileSystem.getInfoAsync(docsDir);
    if (docsInfo.exists) {
      await FileSystem.deleteAsync(docsDir, { idempotent: true });
    }
    
    const thumbsInfo = await FileSystem.getInfoAsync(thumbnailsDir);
    if (thumbsInfo.exists) {
      await FileSystem.deleteAsync(thumbnailsDir, { idempotent: true });
    }
  } catch (error) {
    console.error('Error deleting file directories during data reset:', error);
    throw error;
  }
}
