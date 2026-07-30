export async function generateThumbnail(uri: string, format: string): Promise<string | null> {
  // We're skipping native thumbnail generation for MVP to keep the build simple.
  // The app will fall back to the generic format icons provided by the DocumentCard.
  return null;
}
