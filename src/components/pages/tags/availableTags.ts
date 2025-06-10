export type GenreTag = { id: number; genre: string };
export type PlayerTag = { id: number; players: string };
export type DurationTag = { id: number; duration: "Short" | "Average" | "Long" };

// Example initial tags (these should be managed by TagsPage)
export const genreTags: GenreTag[] = [
  { id: 1, genre: "Strategy" },
  { id: 2, genre: "Party" },
  { id: 3, genre: "Cooperative" },
];

export const playerTags: PlayerTag[] = [
  { id: 1, players: "2-4" },
  { id: 2, players: "4-10" },
  { id: 3, players: "1-5" },
];

export const durationTags: DurationTag[] = [
  { id: 1, duration: "Short" },
  { id: 2, duration: "Average" },
  { id: 3, duration: "Long" },
];