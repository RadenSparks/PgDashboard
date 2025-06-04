// Types for products and CMS content

export type NamedImage = { url: string; name: string };

export type Product = {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    image: string;
    images: NamedImage[];
    category: string;
    tags: string[];
    stock: number;
    sold: number;
    discount: number;
    status: string;
    meta: { title: string; description: string };
    createdAt: string;
    updatedAt: string;
};

export type CmsContent = {
    heroTitle: string;
    heroSubtitle: string;
    heroImages: string[];
    aboutTitle: string;
    aboutText: string;
    aboutImages: string[];
    sliderImages?: string[];
    detailsTitle?: string;
    detailsContent?: string;
};