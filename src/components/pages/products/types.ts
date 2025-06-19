// Types for products and CMS content

import type { Category } from "../categories/categoriesData";

export type NamedImage = { id: number; url: string; name: string };

export type Product = {
    id: number;
    product_name: string;
    slug: string;
    description: string;
    product_price: number;
    image: string | File;
    images: NamedImage[] & File[];
    category_ID: string | Category
    tags: string[] | string;
    quantity_stock: number;
    quantity_sold: number;
    discount: number;
    status: string;
    meta_title: string;
    meta_description: string;
    featured: Featured[];
    featuredImage: File[];
    deleteImages?: number[];
    created_at: string;
    updated_at: string;
};

export type Featured = {
    title: string;
    content: string;
    ord: number | null
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