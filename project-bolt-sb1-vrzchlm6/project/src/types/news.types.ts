import { ImageData } from './api.types';

export interface NewsArticle {
    id: number;
    attributes: {
        Title: string;
        ShortDescription: string;
        Content: string;
        Slug: string;
        Location: string;
        TimePeriod: string;
        publishedAt: string;
        BreadCrumb?: Array<{
            Label: string;
            Link: string;
        }>;
        HeroImage?: ImageData;
        CoverImage?: ImageData;
        CategoryChip?: {
            ImageLink: string;
            Image?: ImageData;
        };
        seo?: {
            metaTitle: string;
            metaDescription: string;
            keywords: string;
        };
    };
}

export interface NewsResponse {
    data: NewsArticle[];
}

export interface NewsDetailResponse {
    data: NewsArticle;
}
