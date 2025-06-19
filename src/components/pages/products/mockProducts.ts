import type { Product } from "./types";

// Each product can have multiple genres, one player tag, and one duration tag in the tags array.
// Example: ["Strategy", "Party", "2-4", "Short"]

export const mockProducts: Product[] = [
    {
        id: 1,
        name: "UNO",
        slug: "uno",
        description: "Classic card game for all ages. Easy to learn and fun to play with family or friends.",
        price: 19.99,
        image: "https://i5.walmartimages.com/seo/Giant-UNO-Card-Game-for-Kids-Adults-and-Family-Night-108-Oversized-Cards-for-2-10-Players_a31dca6f-015a-4cd5-91f0-599908967b6c.04906de4d872e31806f519775b77ad4e.jpeg",
        images: [
            { url: "https://i5.walmartimages.com/seo/Giant-UNO-Card-Game-for-Kids-Adults-and-Family-Night-108-Oversized-Cards-for-2-10-Players_a31dca6f-015a-4cd5-91f0-599908967b6c.04906de4d872e31806f519775b77ad4e.jpeg", name: "UNO Main" },
            { url: "https://m.media-amazon.com/images/I/61+yRmkcTVL.jpg", name: "UNO Alt" }
        ],
        category: "Card Game",
        tags: ["Party", "2-10", "Short"], // UNO is a party game, 2-10 players, short duration
        stock: 120,
        sold: 40,
        discount: 10,
        status: "Available",
        meta: {
            title: "UNO - Classic Card Game",
            description: "Buy UNO, the classic card game for family and friends, at the best price."
        },
        createdAt: "2025-06-01T10:00:00Z",
        updatedAt: "2025-06-03T14:30:00Z"
    },
    {
        id: 2,
        name: "7 Wonders",
        slug: "7-wonders",
        description: "Award-winning strategy game. Build your civilization and lead it to glory.",
        price: 59.99,
        image: "https://bizweb.dktcdn.net/100/316/286/articles/81v6x774i3l.jpeg?v=1671187787903",
        images: [
            { url: "https://bizweb.dktcdn.net/100/316/286/articles/81v6x774i3l.jpeg?v=1671187787903", name: "7 Wonders Main" },
            { url: "https://cf.shopee.vn/file/2b1e5b6e8a7e3c2b1c8e8f2b1e5b6e8a", name: "7 Wonders Alt" }
        ],
        category: "Strategy Game",
        tags: ["Strategy", "Cooperative", "3-7", "Average"], // Multiple genres, 3-7 players, average duration
        stock: 45,
        sold: 100,
        discount: 0,
        status: "Available",
        meta: {
            title: "7 Wonders - Strategy Board Game",
            description: "Buy 7 Wonders, the award-winning strategy board game, and build your civilization."
        },
        createdAt: "2025-05-20T09:00:00Z",
        updatedAt: "2025-06-01T12:00:00Z"
    },
    {
        id: 3,
        name: "Zoo King",
        slug: "zoo-king",
        description: "Fun and fast-paced card game where you build your own zoo.",
        price: 29.99,
        image: "https://m.media-amazon.com/images/I/61+yRmkcTVL.jpg",
        images: [
            { url: "https://m.media-amazon.com/images/I/61+yRmkcTVL.jpg", name: "Zoo King Main" }
        ],
        category: "Card Game",
        tags: ["Strategy", "2-4", "Short"], // Strategy, 2-4 players, short duration
        stock: 0,
        sold: 75,
        discount: 5,
        status: "Unavailable",
        meta: {
            title: "Zoo King - Build Your Own Zoo Card Game",
            description: "Zoo King is a fast-paced card game for animal lovers and families."
        },
        createdAt: "2025-04-15T15:30:00Z",
        updatedAt: "2025-05-01T10:00:00Z"
    },
    {
        id: 4,
        name: "Dice Tray",
        slug: "dice-tray",
        description: "A premium dice tray for all your board game needs.",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
        images: [
            { url: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308", name: "Dice Tray Main" }
        ],
        category: "Accessories",
        tags: [], // Accessories do not require tags
        stock: 200,
        sold: 30,
        discount: 0,
        status: "Available",
        meta: {
            title: "Dice Tray - Board Game Accessory",
            description: "Keep your dice rolls contained and your table safe with this premium dice tray."
        },
        createdAt: "2025-06-05T08:00:00Z",
        updatedAt: "2025-06-06T10:00:00Z"
    }
];

export const emptyProduct: Product = {
    id: 0,
    product_name: "",
    slug: "",
    description: "",
    product_price: 0,
    image: "",
    images: [],
    category_ID: "",
    tags: [],
    quantity_stock: 0,
    quantity_sold: 0,
    discount: 0,
    status: "Available",
    meta_title: "",
    meta_description: "",
    created_at: "",
    updated_at: "",
    featured: [{ title: "", content: "", ord: null }],
    featuredImage: []
};