import { ImageData } from './api.types';

export interface CaseStudy {
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
        HeroImage?: ImageData;
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

export interface CaseStudiesResponse {
    data: CaseStudy[];
}

export interface CaseStudyDetailResponse {
    data: CaseStudy;
}
