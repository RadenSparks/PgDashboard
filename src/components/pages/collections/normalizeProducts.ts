import type { Product } from "../../../redux/api/productsApi";

type Category = { id: number; name: string; deletedAt?: string | null };

export function normalizeProducts(
  products: Product[],
  categories: Category[]
): Product[] {
  return products.map(p => {
    let categoryObj;
    if (typeof p.category_ID === "object" && p.category_ID !== null) {
      categoryObj = {
        ...p.category_ID,
        deletedAt: p.category_ID.deletedAt ?? null,
      };
    } else if (typeof p.category_ID === "number") {
      const found = categories.find(
        cat => cat && typeof cat.id === "number" && cat.id === (p.category_ID as unknown as number)
      );
      categoryObj = found
        ?? { id: p.category_ID, name: "Unknown", deletedAt: null };
    } else {
      categoryObj = { id: 0, name: "Unknown", deletedAt: null };
    }
    return {
      ...p,
      category_ID: categoryObj,
      tags: Array.isArray(p.tags) ? p.tags : [],
    };
  });
}