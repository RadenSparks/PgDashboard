import { useState } from "react";
import { Button } from "../../widgets/button";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";

type GenreTag = { id: number; genre: string };
type PlayerTag = { id: number; players: string };
type DurationTag = { id: number; duration: "Short" | "Average" | "Long" };

const initialGenreTags: GenreTag[] = [
  { id: 1, genre: "Strategy" },
  { id: 2, genre: "Party" },
  { id: 3, genre: "Cooperative" },
];

const initialPlayerTags: PlayerTag[] = [
  { id: 1, players: "2-4" },
  { id: 2, players: "4-10" },
  { id: 3, players: "1-5" },
];

const initialDurationTags: DurationTag[] = [
  { id: 1, duration: "Short" },
  { id: 2, duration: "Average" },
  { id: 3, duration: "Long" },
];

const durationOptions = ["Short", "Average", "Long"] as const;

const TagsPage = () => {
  // Genre
  const [genreTags, setGenreTags] = useState<GenreTag[]>(initialGenreTags);
  const [newGenre, setNewGenre] = useState("");
  const [editingGenreId, setEditingGenreId] = useState<number | null>(null);
  const [editGenre, setEditGenre] = useState("");

  // Players
  const [playerTags, setPlayerTags] = useState<PlayerTag[]>(initialPlayerTags);
  const [newPlayers, setNewPlayers] = useState("");
  const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null);
  const [editPlayers, setEditPlayers] = useState("");

  // Duration
  const [durationTags, setDurationTags] = useState<DurationTag[]>(initialDurationTags);
  const [newDuration, setNewDuration] = useState<DurationTag["duration"]>("Short");
  const [editingDurationId, setEditingDurationId] = useState<number | null>(null);
  const [editDuration, setEditDuration] = useState<DurationTag["duration"]>("Short");

  // Genre handlers
  const handleAddGenre = () => {
    if (!newGenre.trim()) return;
    setGenreTags([...genreTags, { id: Date.now(), genre: newGenre.trim() }]);
    setNewGenre("");
  };
  const handleDeleteGenre = (id: number) => setGenreTags(genreTags.filter(g => g.id !== id));
  const handleEditGenre = (tag: GenreTag) => {
    setEditingGenreId(tag.id);
    setEditGenre(tag.genre);
  };
  const handleSaveGenre = () => {
    setGenreTags(genreTags.map(g => g.id === editingGenreId ? { ...g, genre: editGenre } : g));
    setEditingGenreId(null);
    setEditGenre("");
  };

  // Player handlers
  const handleAddPlayers = () => {
    if (!newPlayers.trim()) return;
    setPlayerTags([...playerTags, { id: Date.now(), players: newPlayers.trim() }]);
    setNewPlayers("");
  };
  const handleDeletePlayers = (id: number) => setPlayerTags(playerTags.filter(p => p.id !== id));
  const handleEditPlayers = (tag: PlayerTag) => {
    setEditingPlayerId(tag.id);
    setEditPlayers(tag.players);
  };
  const handleSavePlayers = () => {
    setPlayerTags(playerTags.map(p => p.id === editingPlayerId ? { ...p, players: editPlayers } : p));
    setEditingPlayerId(null);
    setEditPlayers("");
  };

  // Duration handlers
  const handleAddDuration = () => {
    if (!newDuration) return;
    setDurationTags([...durationTags, { id: Date.now(), duration: newDuration }]);
    setNewDuration("Short");
  };
  const handleDeleteDuration = (id: number) => setDurationTags(durationTags.filter(d => d.id !== id));
  const handleEditDuration = (tag: DurationTag) => {
    setEditingDurationId(tag.id);
    setEditDuration(tag.duration);
  };
  const handleSaveDuration = () => {
    setDurationTags(durationTags.map(d => d.id === editingDurationId ? { ...d, duration: editDuration } : d));
    setEditingDurationId(null);
    setEditDuration("Short");
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Tag Categories Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Genre Tags */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Genres</h3>
          <div className="flex gap-2 mb-4">
            <input
              className="border rounded px-2 py-1 text-xs flex-1"
              placeholder="Add genre"
              value={newGenre}
              onChange={e => setNewGenre(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAddGenre()}
            />
            <Button
              size="sm"
              className="bg-green-100 text-green-800 border border-green-300 hover:bg-green-200"
              onClick={handleAddGenre}
            >
              <FaPlus />
            </Button>
          </div>
          <table className="min-w-full text-sm">
            <tbody>
              {genreTags.map(tag =>
                editingGenreId === tag.id ? (
                  <tr key={tag.id}>
                    <td>
                      <input
                        className="border rounded px-2 py-1 text-xs"
                        value={editGenre}
                        onChange={e => setEditGenre(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSaveGenre()}
                      />
                    </td>
                    <td className="flex gap-2">
                      <Button size="sm" className="bg-green-100" onClick={handleSaveGenre}><FaSave /></Button>
                      <Button size="sm" className="bg-gray-200" onClick={() => setEditingGenreId(null)}><FaTimes /></Button>
                    </td>
                  </tr>
                ) : (
                  <tr key={tag.id}>
                    <td>{tag.genre}</td>
                    <td className="flex gap-2">
                      <Button size="sm" className="bg-yellow-100" onClick={() => handleEditGenre(tag)}><FaEdit /></Button>
                      <Button size="sm" className="bg-red-100" onClick={() => handleDeleteGenre(tag.id)}><FaTrash /></Button>
                    </td>
                  </tr>
                )
              )}
              {genreTags.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-gray-400">No genres found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Player Tags */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Number of Players</h3>
          <div className="flex gap-2 mb-4">
            <input
              className="border rounded px-2 py-1 text-xs flex-1"
              placeholder="Add player count (e.g. 2-4, 1-8, Solo)"
              value={newPlayers}
              onChange={e => setNewPlayers(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAddPlayers()}
            />
            <Button
              size="sm"
              className="bg-green-100 text-green-800 border border-green-300 hover:bg-green-200"
              onClick={handleAddPlayers}
            >
              <FaPlus />
            </Button>
          </div>
          <table className="min-w-full text-sm">
            <tbody>
              {playerTags.map(tag =>
                editingPlayerId === tag.id ? (
                  <tr key={tag.id}>
                    <td>
                      <input
                        className="border rounded px-2 py-1 text-xs"
                        value={editPlayers}
                        onChange={e => setEditPlayers(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSavePlayers()}
                      />
                    </td>
                    <td className="flex gap-2">
                      <Button size="sm" className="bg-green-100" onClick={handleSavePlayers}><FaSave /></Button>
                      <Button size="sm" className="bg-gray-200" onClick={() => setEditingPlayerId(null)}><FaTimes /></Button>
                    </td>
                  </tr>
                ) : (
                  <tr key={tag.id}>
                    <td>{tag.players}</td>
                    <td className="flex gap-2">
                      <Button size="sm" className="bg-yellow-100" onClick={() => handleEditPlayers(tag)}><FaEdit /></Button>
                      <Button size="sm" className="bg-red-100" onClick={() => handleDeletePlayers(tag.id)}><FaTrash /></Button>
                    </td>
                  </tr>
                )
              )}
              {playerTags.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-gray-400">No player numbers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Duration Tags */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Game Duration</h3>
          <div className="flex gap-2 mb-4">
            <select
              className="border rounded px-2 py-1 text-xs flex-1"
              value={newDuration}
              onChange={e => setNewDuration(e.target.value as DurationTag["duration"])}
            >
              {durationOptions.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <Button
              size="sm"
              className="bg-green-100 text-green-800 border border-green-300 hover:bg-green-200"
              onClick={handleAddDuration}
            >
              <FaPlus />
            </Button>
          </div>
          <table className="min-w-full text-sm">
            <tbody>
              {durationTags.map(tag =>
                editingDurationId === tag.id ? (
                  <tr key={tag.id}>
                    <td>
                      <select
                        className="border rounded px-2 py-1 text-xs"
                        value={editDuration}
                        onChange={e => setEditDuration(e.target.value as DurationTag["duration"])}
                      >
                        {durationOptions.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </td>
                    <td className="flex gap-2">
                      <Button size="sm" className="bg-green-100" onClick={handleSaveDuration}><FaSave /></Button>
                      <Button size="sm" className="bg-gray-200" onClick={() => setEditingDurationId(null)}><FaTimes /></Button>
                    </td>
                  </tr>
                ) : (
                  <tr key={tag.id}>
                    <td>{tag.duration}</td>
                    <td className="flex gap-2">
                      <Button size="sm" className="bg-yellow-100" onClick={() => handleEditDuration(tag)}><FaEdit /></Button>
                      <Button size="sm" className="bg-red-100" onClick={() => handleDeleteDuration(tag.id)}><FaTrash /></Button>
                    </td>
                  </tr>
                )
              )}
              {durationTags.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-gray-400">No durations found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-6 text-gray-500 text-sm">
        <strong>Tip:</strong> Manage genres, player numbers, and durations separately. These tags will be available for assignment to boardgames in the Products page.
      </div>
    </div>
  );
};

export default TagsPage;