import { API_BASE_URL, getAuthHeaders } from './client';
import { ServicesResponse, Service } from '../../types';

export const servicesService = {
    async getAll(): Promise<ServicesResponse> {
        const response = await fetch(`${API_BASE_URL}/api/services-detail?populate=*`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch services detail');
        }

        return response.json();
    },

    async getById(id: number): Promise<Service | null> {
        // Strapi filter syntax: filters[id][$eq]=value
        const response = await fetch(`${API_BASE_URL}/api/services-detail?filters[id][$eq]=${id}&populate=*`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch service detail');
        }

        const json = await response.json();
        return json.data && json.data.length > 0 ? json.data[0] : null;
    },

    async create(data: Partial<Service['attributes']>): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/services-detail`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ data }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || 'Failed to create service');
        }

        return response.json();
    },

    async update(id: number, data: Partial<Service['attributes']>): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/services-detail/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ data }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || 'Failed to update service');
        }

        return response.json();
    },
};
