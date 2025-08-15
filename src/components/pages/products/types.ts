// Types for products and CMS content

export interface NamedImage {
  folder: unknown;
  id: number;
  url: string;
  name: string; // "main" for main image, others for gallery
  file?: File;  // Only for upload
}

export type Tag = {
  id: number;
  name: string;
  type: string;
};

export type Category = {
  id: number;
  name: string;
};

export type Publisher = {
  id: number;
  name: string;
};

export interface Product {
  id: number;
  product_name: string;
  description: string;
  product_price: number;
  discount: number;
  slug: string;
  meta_title: string;
  meta_description: string;
  quantity_sold: number;
  quantity_stock: number;
  status: string;
  category_ID: { id: number; name: string };
  publisherID: { id: number; name: string }; // unified publisher field
  tags: unknown[];
  images: unknown[];
  mainImage?: File | string;
  deleteImages?: unknown[];
}

export interface FeaturedSection {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  textBgColor?: string;
  isImageRight?: boolean;
}

export type TabSection = {
  title: string;
  content: string;
  images: string[];
  references?: { title: string; link: string }[];
};

export interface CmsContent {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImages?: string[]; // array, not string
  aboutTitle?: string;
  aboutText?: string;
  aboutImages?: string[];
  sliderImages?: string[];
  detailsTitle?: string;
  detailsContent?: string;
  tabs?: TabSection[];
  fontFamily?: string;
  fontSize?: string;
  textColor?: string;
  bgColor?: string;
  featuredSections?: FeaturedSection[]; //
}