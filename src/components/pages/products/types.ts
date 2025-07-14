// Types for products and CMS content

export interface NamedImage {
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
  slug: string;
  description: string;
  product_price: number;
  discount: number;
  quantity_stock: number;
  quantity_sold: number;
  status: string;
  category_ID: { id: number; name: string };
  publisher_ID: { id: number; name: string };
  tags: Tag[];
  images: NamedImage[];
  mainImage?: File; // For upload
  featured?: { title: string; content: string; ord: number }[];
  meta_title?: string;
  meta_description?: string;
  deleteImages?: number[];
}

export type TabSection = {
  title: string;
  content: string;
  images: string[];
};

export type CmsContent = {
  heroTitle: string;
  heroSubtitle: string;
  heroImages: string[];
  aboutTitle: string;
  aboutText: string;
  aboutImages: string[];
  sliderImages: string[];
  detailsTitle: string;
  detailsContent: string;
  tabs?: TabSection[];
  featuredSections?: {
    title: string;
    description: string;
    imageSrc: string;
    imageAlt?: string;
    textBgColor?: string;
    isImageRight?: boolean;
  }[];
  fontFamily?: string;
  fontSize?: string;
  textColor?: string;
  bgColor?: string;
  warranty?: string;
  shippingInfo?: string;
};