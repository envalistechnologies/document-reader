import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  
  // Use a shared promise so concurrent callers all wait for the same init
  if (!dbPromise) {
    dbPromise = (async () => {
      const database = await SQLite.openDatabaseAsync('docreader.db');
      await initDatabase(database);
      db = database;
      return database;
    })();
  }
  
  return dbPromise;
}

async function initDatabase(database: SQLite.SQLiteDatabase) {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      filename TEXT NOT NULL,
      format TEXT NOT NULL,
      file_path TEXT,
      file_hash TEXT NOT NULL,
      file_size_bytes INTEGER NOT NULL,
      page_count INTEGER,
      thumbnail_path TEXT,
      imported_at INTEGER NOT NULL,
      last_opened_at INTEGER,
      last_read_page INTEGER DEFAULT 0,
      is_favorite INTEGER DEFAULT 0,
      folder_id TEXT,
      content_uri TEXT
    );
    CREATE TABLE IF NOT EXISTS folders (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS scanned_documents (
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
    CREATE TABLE IF NOT EXISTS saf_granted_folders (
      uri TEXT PRIMARY KEY,
      display_name TEXT NOT NULL,
      granted_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_documents_hash ON documents(file_hash);
    CREATE INDEX IF NOT EXISTS idx_documents_last_opened ON documents(last_opened_at);
    CREATE INDEX IF NOT EXISTS idx_documents_folder ON documents(folder_id);
    CREATE INDEX IF NOT EXISTS idx_scanned_content_uri ON scanned_documents(content_uri);
    CREATE INDEX IF NOT EXISTS idx_scanned_format ON scanned_documents(format);
  `);

  // Migration: add content_uri column to documents if upgrading from older schema
  try {
    await database.runAsync(`ALTER TABLE documents ADD COLUMN content_uri TEXT`);
  } catch (_) {
    // Column already exists — expected on subsequent launches
  }

  // Migration: make file_path nullable (SQLite doesn't support ALTER COLUMN,
  // but the CREATE TABLE IF NOT EXISTS above already defines it as nullable
  // for fresh installs. Existing rows with file_path set are unaffected.)
}
