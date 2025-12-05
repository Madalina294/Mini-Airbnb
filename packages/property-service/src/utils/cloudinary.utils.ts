/**
 * Cloudinary Utilities
 * Helper functions pentru validarea URL-urilor Cloudinary
 * Similar cu validatori custom în Spring Boot
 */

/**
 * Verifică dacă un URL este de la Cloudinary
 * @param url - URL-ul de verificat
 * @returns true dacă URL-ul este de la Cloudinary
 */
export const isCloudinaryUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    // Cloudinary URLs sunt de forma: https://res.cloudinary.com/{cloud_name}/...
    return urlObj.hostname.includes('cloudinary.com') || 
           urlObj.hostname.includes('res.cloudinary.com');
  } catch {
    return false;
  }
};

/**
 * Validează un array de URL-uri Cloudinary
 * @param urls - Array de URL-uri
 * @returns true dacă toate URL-urile sunt valide Cloudinary URLs
 */
export const validateCloudinaryUrls = (urls: string[]): boolean => {
  if (!Array.isArray(urls)) {
    return false;
  }

  return urls.every((url) => {
    if (typeof url !== 'string') {
      return false;
    }
    // Verifică că este URL valid
    try {
      new URL(url);
    } catch {
      return false;
    }
    // Verifică că este de la Cloudinary
    return isCloudinaryUrl(url);
  });
};