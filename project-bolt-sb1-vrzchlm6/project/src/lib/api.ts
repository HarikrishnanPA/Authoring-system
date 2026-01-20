const API_BASE_URL = 'https://strapi-stage.tarento.com';

export function getImageUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  return `${API_BASE_URL}${url}`;
}

export interface LoginRequest {
  email: string;
  password: string;
}

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

export interface LoginResponse {
  data: {
    token: string;
    user: User;
  };
}

export interface MediaFormat {
  url: string;
  width: number;
  height: number;
}

export interface MediaFile {
  id: number;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  mime: string;
  width: number;
  height: number;
  url: string;
  formats: {
    thumbnail?: MediaFormat;
    small?: MediaFormat;
    medium?: MediaFormat;
    large?: MediaFormat;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export class ApiService {
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
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
  }

  static async logout(): Promise<void> {
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
  }

  static getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  static setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  static removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  static getUser(): User | null {
    const userJson = localStorage.getItem('auth_user');
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  static setUser(user: User): void {
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  static removeUser(): void {
    localStorage.removeItem('auth_user');
  }

  static async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getToken();

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

  static async getCaseStudies(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/case-studies?populate=*&publicationState=preview`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch case studies');
    }

    return response.json();
  }

  static async getCaseStudy(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/case-studies/${id}?populate=*`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch case study');
    }

    return response.json();
  }

  static async createCaseStudy(data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/case-studies`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Failed to create case study');
    }

    return response.json();
  }

  static async updateCaseStudy(id: number, data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/case-studies/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Failed to update case study');
    }

    return response.json();
  }

  static async getNews(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/news-lists?populate=*&publicationState=preview`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    return response.json();
  }

  static async getNewsArticle(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/news-lists/${id}?populate=*`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch news article');
    }

    return response.json();
  }

  static async createNewsArticle(data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/news-lists`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Failed to create news article');
    }

    return response.json();
  }

  static async updateNewsArticle(id: number, data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/news-lists/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Failed to update news article');
    }

    return response.json();
  }

  static async getServicesDetail(): Promise<ServicesDetailResponse> {
    const response = await fetch(`${API_BASE_URL}/api/services-detail?populate=*&publicationState=preview`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch services detail');
    }

    return response.json();
  }

  static async getServiceDetailById(id: number): Promise<ServicesDetailItem | null> {
    // Since the endpoint is /api/services-detail, we assume it's a single type or collection.
    // Based on the list response, it returns an array. So we can filter by ID.
    // Strapi filter syntax: filters[id][$eq]=value
    const response = await fetch(`${API_BASE_URL}/api/services-detail?filters[id][$eq]=${id}&populate=*&publicationState=preview`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch service detail');
    }

    const json = await response.json();
    return json.data && json.data.length > 0 ? json.data[0] : null;
  }

  static async createService(data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/services-detail`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Failed to create service');
    }

    return response.json();
  }

  static async updateService(id: number, data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/services-detail/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Failed to update service');
    }

    return response.json();
  }

  // Media Library
  static async getMediaFiles(): Promise<MediaFile[]> {
    const response = await fetch(`${API_BASE_URL}/api/upload/files?sort=createdAt:desc`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch media files');
    }

    return response.json();
  }

  static async getMediaFileById(id: number): Promise<MediaFile> {
    const response = await fetch(`${API_BASE_URL}/api/upload/files/${id}`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch media file');
    }

    return response.json();
  }
}

export type ServicesDetailItem = ServicesDetailResponse['data'][0];

export interface ServicesDetailResponse {
  data: Array<{
    id: number;
    attributes: {
      Slug: string;
      Title: string;
      Description: string;
      CTAText: string;
      CTALink: string;
      createdAt?: string;
      updatedAt?: string;
      publishedAt?: string;

      SectionOneTag: string;
      SectionOneTitle: string;
      SectionOneStrongText: string;
      SectionOnePrimaryDescription: string;
      SectionOneSecondaryDescription: string;

      SectionTwoTag: string;
      SectionTwoTitle: string;
      SectionTwoDescription: string;

      SectionThreeTitle: string;
      SectionThreeImage?: {
        data?: {
          attributes: {
            url: string;
          };
        };
      };

      SectionFourTitle: string;

      SectionSixTag: string;
      SectionSixTitle: string;

      SectionSevenTag: string;
      SectionSevenTitle: string;

      CTAForm: {
        Title: string;
        Description: string;
      };

      BreadCrumb: Array<{
        Label: string;
        Link: string;
        isMegamenu: boolean;
      }>;
      Image: {
        data: {
          attributes: {
            url: string;
          };
        };
      };
      HeroCard: Array<{
        Title: string;
        Description: string;
      }>;
      SectionOneCard: Array<{
        Title: string;
        Description: string;
        Tag: string;
        Icon: {
          data: {
            attributes: {
              url: string;
            };
          };
        };
      }>;
      SectionTwoCard: Array<{
        PrimaryTitle: string;
        PrimaryDescription: string;
        SecondaryTitle: string;
        SecondaryDescription: string;
        PrimaryIcon: { data: { attributes: { url: string } } };
        SecondaryIcon: { data: { attributes: { url: string } } };
      }>;
      SectionThreeCard: Array<{
        Title: string;
        SubTitle: string;
        Image: { data: { attributes: { url: string } } };
      }>;
      SectionFourCard: Array<{
        Metric: string;
        Description: string;
      }>;
      SectionSixCardOne: Array<{
        Title: string;
        Description: string;
        Tag: string;
        Icon: { data: { attributes: { url: string } } };
      }>;
      SectionSixCardTwo: Array<{
        Title: string;
        Text: Array<{ Text: string }>;
      }>;
      SectionSevenCard: Array<{
        Metric: string;
        PrimaryTitle: string;
        Description: string;
        SecondaryTitle: string;
        TagList: Array<{ Text: string }>;
      }>;
      ListItems: Array<{
        PrimaryTag: string;
        Title: string;
        Description: string;
        SecondaryTag: string;
        AlignImageToLeft: boolean;
        Image: { data: { attributes: { url: string } } };
        Card: {
          Title: string;
          Text: Array<{ Text: string }>;
        };
      }>;
    };
  }>;
}

export interface CaseStudyDetailItem {
  id: number;
  attributes: {
    Title: string;
    ShortDescription: string;
    Content: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    Slug: string;
    Author?: string;
    Quote?: string;
    QuoteAuthor?: string;
    HeroImage?: {
      data?: {
        attributes: {
          url: string;
          alternativeText?: string;
        };
      };
    };
    Tags?: Array<{
      Name: string;
    }>;
    Results?: Array<{
      Value: string;
      Label: string;
      Description?: string;
    }>;
  };
}

export interface NewsDetailItem {
  id: number;
  attributes: {
    Title: string;
    ShortDescription: string;
    Content: string;
    Slug: string;
    Location: string;
    TimePeriod: string;
    publishedAt: string;
    HeroImage?: {
      data?: {
        attributes: {
          url: string;
          alternativeText?: string;
        };
      };
    };
    CategoryChip?: {
      ImageLink: string;
      Image?: {
        data?: {
          attributes: {
            url: string;
          };
        };
      };
    };
  };
}
