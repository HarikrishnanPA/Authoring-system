// Common API types
export interface User {
    id: number;
    firstname: string;
    lastname: string;
    username: string | null;
    email: string;
    isActive: boolean;
    blocked: boolean;
    preferedLanguage: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    data: {
        token: string;
        user: User;
    };
}

// Image/Media types
export interface ImageData {
    data?: {
        attributes: {
            url: string;
            alternativeText?: string;
        };
    };
}

export interface IconData {
    data: {
        attributes: {
            url: string;
        };
    };
}
