import { API_BASE_URL, getAuthHeaders } from './client';
import { NewsResponse, NewsDetailResponse, NewsArticle } from '../../types';

export const newsService = {
    async getAll(): Promise<NewsResponse> {
        const response = await fetch(`${API_BASE_URL}/api/news-lists?populate=*`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch news');
        }

        return response.json();
    },

    async getById(id: number): Promise<NewsDetailResponse> {
        const response = await fetch(`${API_BASE_URL}/api/news-lists/${id}?populate=*`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch news article');
        }

        return response.json();
    },

    async create(data: Partial<NewsArticle['attributes']>): Promise<NewsDetailResponse> {
        const response = await fetch(`${API_BASE_URL}/api/news-lists`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ data }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || 'Failed to create news article');
        }

        return response.json();
    },

    async update(id: number, data: Partial<NewsArticle['attributes']>): Promise<NewsDetailResponse> {
        const response = await fetch(`${API_BASE_URL}/api/news-lists/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ data }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || 'Failed to update news article');
        }

        return response.json();
    },
};
