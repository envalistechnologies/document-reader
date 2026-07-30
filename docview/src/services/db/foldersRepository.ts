import { getDatabase } from './database';

export interface FolderRecord {
  id: string;
  name: string;
  created_at: number;
  updated_at: number;
}

export async function insertFolder(folder: FolderRecord): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO folders (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)`,
    [folder.id, folder.name, folder.created_at, folder.updated_at]
  );
}

export async function getAllFolders(): Promise<FolderRecord[]> {
  const db = await getDatabase();
  return await db.getAllAsync<FolderRecord>(`SELECT * FROM folders ORDER BY name ASC`);
}

export async function getFolderById(id: string): Promise<FolderRecord | null> {
  const db = await getDatabase();
  return await db.getFirstAsync<FolderRecord>(`SELECT * FROM folders WHERE id = ?`, [id]);
}

export async function updateFolder(id: string, name: string, updatedAt: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE folders SET name = ?, updated_at = ? WHERE id = ?`,
    [name, updatedAt, id]
  );
}

export async function deleteFolder(id: string): Promise<void> {
  const db = await getDatabase();
  // We need to also clear the folder_id for documents that were in this folder
  await db.runAsync(`UPDATE documents SET folder_id = NULL WHERE folder_id = ?`, [id]);
  await db.runAsync(`DELETE FROM folders WHERE id = ?`, [id]);
}
