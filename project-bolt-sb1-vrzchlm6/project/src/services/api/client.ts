export const API_BASE_URL = 'https://strapi-stage.tarento.com';

export function getAuthHeaders(): HeadersInit {
    const token = import.meta.env.VITE_STRAPI_API_TOKEN;
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = localStorage.getItem('auth_token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    return fetch(url, {
        ...options,
        headers,
    });
}
