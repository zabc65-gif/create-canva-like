// Configuration Unsplash API
// Pour obtenir une clé API: https://unsplash.com/developers

export const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || '';
export const UNSPLASH_API_URL = 'https://api.unsplash.com';

// Fonction pour télécharger une image (requis par les conditions d'utilisation d'Unsplash)
export async function triggerUnsplashDownload(downloadLocation: string) {
  if (!UNSPLASH_ACCESS_KEY) return;

  try {
    await fetch(downloadLocation, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });
  } catch (error) {
    console.error('Error triggering Unsplash download:', error);
  }
}
