// Utility function to construct full image URLs from Strapi
export function getImageUrl(url: string | undefined | null): string | undefined {
    if (!url) return undefined;

    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    const API_BASE_URL = 'https://strapi-stage.tarento.com';
    return `${API_BASE_URL}${url}`;
}
