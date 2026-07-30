import * as FileSystem from 'expo-file-system/legacy';
import * as Crypto from 'expo-crypto';

export async function persistPickedFile(pickedUri: string, originalName: string): Promise<string> {
  const docsDir = `${FileSystem.documentDirectory}documents/`;
  
  const dirInfo = await FileSystem.getInfoAsync(docsDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(docsDir, { intermediates: true });
  }

  // Generate safe filename to prevent collisions or invalid characters
  const timestamp = Date.now();
  const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const destPath = `${docsDir}${timestamp}_${safeName}`;
  
  await FileSystem.copyAsync({ from: pickedUri, to: destPath });
  return destPath;
}

export async function hashFile(fileUri: string): Promise<string> {
  // Read file as base64 string
  const content = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
  // Digest base64 content
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, content);
}
