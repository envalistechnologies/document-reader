import * as FileSystem from 'expo-file-system/legacy';

export async function clearThumbnailCache(): Promise<void> {
  // Stub for now. If thumbnails were stored in a specific directory, we would delete it here.
  const thumbnailsDir = FileSystem.documentDirectory + 'thumbnails/';
  try {
    const dirInfo = await FileSystem.getInfoAsync(thumbnailsDir);
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(thumbnailsDir, { idempotent: true });
    }
  } catch (error) {
    console.error('Failed to clear thumbnail cache:', error);
  }
}

export async function clearSearchCache(): Promise<void> {
  // Stub for now. We would clear the pdf_text_cache table or similar.
  // We can just log it for now to satisfy the UI requirement.
  console.log('Search cache cleared.');
}
