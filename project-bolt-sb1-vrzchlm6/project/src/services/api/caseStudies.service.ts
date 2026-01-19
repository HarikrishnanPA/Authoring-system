import { API_BASE_URL, getAuthHeaders } from './client';
import { CaseStudiesResponse, CaseStudyDetailResponse } from '../../types';

export const caseStudiesService = {
    async getAll(): Promise<CaseStudiesResponse> {
        const response = await fetch(`${API_BASE_URL}/api/case-studies?populate=*`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch case studies');
        }

        return response.json();
    },

    async getById(id: number): Promise<CaseStudyDetailResponse> {
        const response = await fetch(`${API_BASE_URL}/api/case-studies/${id}?populate=*`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch case study');
        }

        return response.json();
    },
};
