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
  deletedAt?: string | null; // <-- Add this line
};

export type Category = {
  id: number;
  name: string;
  deletedAt: string | null; // <-- Make this required, not optional
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
  category_ID?: {
      id: number;
      name: string;
      deletedAt?: string | null;
  };
  publisherID: { id: number; name: string } | number;
  tags: Tag[];
  images: unknown[];
  deletedAt?: string | null;
  mainImage?: File;
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
  sliderImages?: string[];
  detailsTitle?: string;
  detailsContent?: string;
  tabs?: TabSection[];
  fontFamily?: string;
  fontSize?: string;
  textColor?: string;
  bgColor?: string;
  featuredSections?: FeaturedSection[];
}

export function getBaseSlug(slug: string): string {
  const match = slug.match(/^(.+)-.+$/);
  return match ? match[1] : slug;
}

export function groupProductsByBaseGame(products: Product[]) {
  const baseGames: { [slug: string]: Product } = {};
  const expansions: { [baseSlug: string]: Product[] } = {};

  products.forEach(prod => {
    if (prod.category_ID?.name === "Boardgame") {
      baseGames[prod.slug] = prod;
    } else if (prod.category_ID?.name === "Expansions") {
      const baseSlug = getBaseSlug(prod.slug);
      if (!expansions[baseSlug]) expansions[baseSlug] = [];
      expansions[baseSlug].push(prod);
    }
  });

  return { baseGames, expansions };
}