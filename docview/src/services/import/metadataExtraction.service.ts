import * as FileSystem from 'expo-file-system/legacy';

export async function extractMetadata(uri: string, originalName: string, format: string) {
  const fileInfo = await FileSystem.getInfoAsync(uri);
  
  // By default, just use the filename without extension as the title
  const title = originalName.replace(/\.[^/.]+$/, "");
  
  let pageCount = null;
  // TODO: Add actual EPUB / PDF parsing for titles and page counts in Phase 4 if needed.
  // For Phase 2 MVP, just filename and size is sufficient.

  return {
    title,
    sizeBytes: fileInfo.exists ? fileInfo.size : 0,
    pageCount
  };
}
