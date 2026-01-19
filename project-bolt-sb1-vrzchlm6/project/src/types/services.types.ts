import { ImageData, IconData } from './api.types';

export interface Service {
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
        SectionThreeImage?: ImageData;

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

        Image: ImageData;

        HeroCard: Array<{
            Title: string;
            Description: string;
        }>;

        SectionOneCard: Array<{
            Title: string;
            Description: string;
            Tag: string;
            Icon: IconData;
        }>;

        SectionTwoCard: Array<{
            PrimaryTitle: string;
            PrimaryDescription: string;
            SecondaryTitle: string;
            SecondaryDescription: string;
            PrimaryIcon: IconData;
            SecondaryIcon: IconData;
        }>;

        SectionThreeCard: Array<{
            Title: string;
            SubTitle: string;
            Image: IconData;
        }>;

        SectionFourCard: Array<{
            Metric: string;
            Description: string;
        }>;

        SectionSixCardOne: Array<{
            Title: string;
            Description: string;
            Tag: string;
            Icon: IconData;
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
            Image: IconData;
            Card: {
                Title: string;
                Text: Array<{ Text: string }>;
            };
        }>;
    };
}

export interface ServicesResponse {
    data: Service[];
}

export interface ServiceDetailResponse {
    data: Service;
}
