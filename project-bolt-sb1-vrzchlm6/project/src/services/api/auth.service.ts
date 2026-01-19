import { API_BASE_URL } from './client';
import { LoginRequest, LoginResponse, User } from '../../types';

export const authService = {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await fetch(`${API_BASE_URL}/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || errorData.message || 'Login failed. Please check your credentials.';
            throw new Error(errorMessage);
        }

        return response.json();
    },

    async logout(): Promise<void> {
        const token = this.getToken();

        if (token) {
            const response = await fetch(`${API_BASE_URL}/admin/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                console.error('Logout API call failed');
            }
        }
    },

    getToken(): string | null {
        return localStorage.getItem('auth_token');
    },

    setToken(token: string): void {
        localStorage.setItem('auth_token', token);
    },

    removeToken(): void {
        localStorage.removeItem('auth_token');
    },

    getUser(): User | null {
        const userJson = localStorage.getItem('auth_user');
        if (!userJson) return null;
        try {
            return JSON.parse(userJson);
        } catch {
            return null;
        }
    },

    setUser(user: User): void {
        localStorage.setItem('auth_user', JSON.stringify(user));
    },

    removeUser(): void {
        localStorage.removeItem('auth_user');
    },
};
