import * as FileSystem from 'expo-file-system/legacy';

export async function validateDocumentFormat(uri: string, originalName: string): Promise<string | null> {
  const ext = originalName.split('.').pop()?.toLowerCase();
  
  // Basic file size check to avoid reading huge files entirely for magic bytes
  // We only need the first few bytes.
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) return null;
    
    // TXT and CSV are hard to definitively validate via magic bytes (they have none).
    // If it claims to be txt or csv, we accept it for now.
    if (ext === 'txt' || ext === 'csv') {
      return ext;
    }

    // Read first 16 bytes for magic byte validation
    const headerBase64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
      length: 16,
      position: 0
    });
    
    // PDF Magic Bytes: %PDF- (25 50 44 46 2D) -> Base64: JVBERi0
    if (headerBase64.startsWith('JVBERi0')) {
      return 'pdf';
    }

    // RTF Magic Bytes: {\rtf1 -> Base64: e1xydGYx
    if (headerBase64.startsWith('e1xydGYx')) {
      return 'rtf';
    }

    // ZIP Magic Bytes (DOCX, XLSX, PPTX, EPUB are ZIP archives): PK\x03\x04 -> Base64: UEsDBA
    if (headerBase64.startsWith('UEsDBA')) {
      if (ext === 'epub' || ext === 'docx' || ext === 'xlsx' || ext === 'pptx') {
        return ext;
      }
      return null;
    }

    // OLE CF Magic Bytes (DOC, XLS, PPT): D0 CF 11 E0 A1 B1 1A E1 -> Base64 starts with: 0M8R4
    if (headerBase64.startsWith('0M8R4')) {
      if (ext === 'doc' || ext === 'xls' || ext === 'ppt') {
        return ext;
      }
      return null;
    }

    return null; // Format not supported or magic bytes didn't match
  } catch (error) {
    console.error("Format validation failed:", error);
    return null;
  }
}
