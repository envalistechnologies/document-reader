import { useState, useEffect } from 'react';
import { 
  FolderRecord, 
  getAllFolders, 
  insertFolder, 
  updateFolder, 
  deleteFolder 
} from '../../../services/db/foldersRepository';
import { updateDocumentFolder } from '../../../services/db/documentsRepository';

export function useFolders() {
  const [folders, setFolders] = useState<FolderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadFolders = async () => {
    try {
      setIsLoading(true);
      const data = await getAllFolders();
      setFolders(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFolders();
  }, []);

  const createNewFolder = async (name: string) => {
    const id = Date.now().toString(); // simple ID generation
    const newFolder: FolderRecord = {
      id,
      name,
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    await insertFolder(newFolder);
    await loadFolders();
    return id;
  };

  const renameFolder = async (id: string, newName: string) => {
    await updateFolder(id, newName, Date.now());
    await loadFolders();
  };

  const removeFolder = async (id: string) => {
    await deleteFolder(id);
    await loadFolders();
  };

  const moveDocument = async (docId: string, folderId: string | null) => {
    await updateDocumentFolder(docId, folderId);
  };

  return {
    folders,
    isLoading,
    error,
    refresh: loadFolders,
    createNewFolder,
    renameFolder,
    removeFolder,
    moveDocument,
  };
}
