import { useState } from "react";
import { Button } from "../../widgets/button";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useAddTagMutation, useDeleteTagMutation, useGetTagsQuery, useUpdateTagMutation } from "../../../redux/api/tagsApi";
import Loading from "../../../components/widgets/loading";


type DurationTag = { duration: "Short" | "Average" | "Long" };
const durationOptions = ["Short", "Average", "Long"] as const;
type Tag = { id: number; name: string; type: string; duration?: DurationTag }



const TagsPage = () => {
  //RTK Query
  const { data: tags, isLoading } = useGetTagsQuery()
  const [addTag] = useAddTagMutation();
  const [updateTag] = useUpdateTagMutation();
  const [deleteTag] = useDeleteTagMutation();
  const genreTags = tags?.filter(c => c.type === 'genre') ?? [];
  const playerTags = tags?.filter(c => c.type === 'players') ?? [];
  const durationTags = tags?.filter(c => c.type === 'duration') ?? [];
  // Genre
  const [newGenre, setNewGenre] = useState("");
  const [editingGenreId, setEditingGenreId] = useState<number>(0);
  const [editGenre, setEditGenre] = useState("");

  // Players
  const [newPlayers, setNewPlayers] = useState("");
  const [editingPlayerId, setEditingPlayerId] = useState<number>(0);
  const [editPlayers, setEditPlayers] = useState("");

  // Duration
  const [newDuration, setNewDuration] = useState<DurationTag["duration"]>("Short");
  const [editingDurationId, setEditingDurationId] = useState<number>(0);
  const [editDuration, setEditDuration] = useState<DurationTag["duration"]>("Short");

  // Genre handlers
  const handleAddGenre = () => {
    if (!newGenre.trim()) return;
    addTag({ name: newGenre.trim(), type: "genre" });
    setNewGenre("");
  };
  const handleDeleteGenre = (id: number) => {
    deleteTag(id)
  }

  const handleEditGenre = (tag: Tag) => {
    setEditingGenreId(tag.id);
    setEditGenre(tag.name);
  };
  const handleSaveGenre = () => {
    updateTag({ id: +(editingGenreId), name: editGenre.trim() });
    setEditingGenreId(0);
    setEditGenre("");
  };

  // Player handlers
  const handleAddPlayers = () => {
    if (!newPlayers.trim()) return;
    addTag({ name: newPlayers.trim(), type: "players" });
    setEditingPlayerId(0);
    setNewPlayers("");
  };
  const handleDeletePlayers = (id: number) => deleteTag(id)
  const handleEditPlayers = (tag: Tag) => {
    setEditingPlayerId(tag.id);
    setEditPlayers(tag.name);
  };
  const handleSavePlayers = () => {
    updateTag({ id: +(editingPlayerId), name: editPlayers.trim() }); setEditingPlayerId(0);
    setEditPlayers("");
  };

  // Duration handlers
  const handleAddDuration = () => {
    if (!newDuration) return;
    addTag({ name: newDuration.trim(), type: "duration" });
    setNewDuration("Short");
  };
  const handleDeleteDuration = (id: number) => deleteTag(id)
  const handleEditDuration = (tag: Tag) => {
    setEditingDurationId(tag.id);
    setEditDuration(tag.duration);
  };
  const handleSaveDuration = () => {
    updateTag({ id: +(editingDurationId), name: editDuration.trim() });
    setEditingDurationId(0);
    setEditDuration("Short");
  };
  if (isLoading) return <Loading></Loading>;
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
                      <Button size="sm" className="bg-gray-200" onClick={() => setEditingGenreId(0)}><FaTimes /></Button>
                    </td>
                  </tr>
                ) : (
                  <tr key={tag.id}>
                    <td>{tag.name}</td>
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
                      <Button size="sm" className="bg-gray-200" onClick={() => setEditingPlayerId(0)}><FaTimes /></Button>
                    </td>
                  </tr>
                ) : (
                  <tr key={tag.id}>
                    <td>{tag.name}</td>
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
                      <Button size="sm" className="bg-gray-200" onClick={() => setEditingDurationId(0)}><FaTimes /></Button>
                    </td>
                  </tr>
                ) : (
                  <tr key={tag.id}>
                    <td>{tag.name}</td>
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