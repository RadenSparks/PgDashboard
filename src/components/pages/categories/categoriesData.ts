export type Category = {
  id: number;
  name: string;
  description: string;
};

export const initialCategories: Category[] = [
  { id: 1, name: "Board Games", description: "Games played on a board, including strategy and family games." },
  { id: 2, name: "Card Games", description: "Games played with cards, from classics to modern." },
  { id: 3, name: "Accessories", description: "Game accessories like dice, sleeves, and organizers." },
];