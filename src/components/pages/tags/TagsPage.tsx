import { useState } from "react";
import { Button } from "../../widgets/button";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaTags, FaUsers, FaClock, FaChild, FaRecycle } from "react-icons/fa";
import { useAddTagMutation, useDeleteTagMutation, useGetTagsQuery, useUpdateTagMutation, useGetDeletedTagsQuery, useRestoreTagMutation } from "../../../redux/api/tagsApi";
import Loading from "../../../components/widgets/loading";

type DurationTag = { duration: "Short" | "Average" | "Long" };
type Tag = { id: number; name: string; type: string; duration?: DurationTag }

const sectionStyles = "bg-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col";
const iconStyles = "inline-block mr-2 text-blue-500 text-xl";

const TagsPage = () => {
  //RTK Query
  const { data: tags, isLoading, refetch } = useGetTagsQuery()
  const [addTag] = useAddTagMutation();
  const [updateTag] = useUpdateTagMutation();
  const [deleteTag] = useDeleteTagMutation();
  const { data: deletedTags = [], isLoading: loadingDeleted, refetch: refetchDeleted } = useGetDeletedTagsQuery();
  const [restoreTag] = useRestoreTagMutation();

  // Filter tags by type
  const genreTags = tags?.filter(c => c.type === 'genre') ?? [];
  const playerTags = tags?.filter(c => c.type === 'players') ?? [];
  const durationTags = tags?.filter(c => c.type === 'duration') ?? [];
  const ageTags = tags?.filter(c => c.type === 'age') ?? [];

  // Genre
  const [newGenre, setNewGenre] = useState("");
  const [editingGenreId, setEditingGenreId] = useState<number>(0);
  const [editGenre, setEditGenre] = useState("");

  // Players
  const [newPlayers, setNewPlayers] = useState("");
  const [editingPlayerId, setEditingPlayerId] = useState<number>(0);
  const [editPlayers, setEditPlayers] = useState("");

  // Duration
  const [newDuration, setNewDuration] = useState("");
  const [editingDurationId, setEditingDurationId] = useState<number>(0);
  const [editDuration, setEditDuration] = useState("");

  // Age Tag State
  const [newAge, setNewAge] = useState("");
  const [editingAgeId, setEditingAgeId] = useState<number>(0);
  const [editAge, setEditAge] = useState("");


  // Genre handlers
  const handleAddGenre = () => {
    if (!newGenre.trim()) return;
    addTag({ name: newGenre.trim(), type: "genre" });
    setNewGenre("");
  };
  const handleDeleteGenre = async (id: number) => {
    await deleteTag(id);
    await refetch();
    await refetchDeleted();
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
  const handleDeletePlayers = async (id: number) => {
    await deleteTag(id);
    await refetch();
    await refetchDeleted();
  }
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
    if (!newDuration.trim()) return;
    addTag({ name: newDuration.trim(), type: "duration" });
    setNewDuration("");
  };
  const handleDeleteDuration = async (id: number) => {
    await deleteTag(id);
    await refetch();
    await refetchDeleted();
  }
  const handleEditDuration = (tag: Tag) => {
    setEditingDurationId(tag.id);
    setEditDuration(tag.name);
  };
  const handleSaveDuration = () => {
    updateTag({ id: +(editingDurationId), name: editDuration.trim() });
    setEditingDurationId(0);
    setEditDuration("");
  };

  // Age handlers
  const handleAddAge = () => {
    if (!newAge.trim()) return;
    addTag({ name: newAge.trim(), type: "age" });
    setNewAge("");
  };
  const handleDeleteAge = async (id: number) => {
    await deleteTag(id);
    await refetch();
    await refetchDeleted();
  }
  const handleEditAge = (tag: Tag) => {
    setEditingAgeId(tag.id);
    setEditAge(tag.name);
  };
  const handleSaveAge = () => {
    updateTag({ id: +(editingAgeId), name: editAge.trim() });
    setEditingAgeId(0);
    setEditAge("");
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-4 sm:p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-blue-800 flex items-center gap-3">
        <FaTags className="text-blue-500" /> Quản lý danh mục thẻ
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {/* Genre Tags */}
        <section className={sectionStyles}>
          <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-700">
            <FaTags className={iconStyles} /> Thể loại
          </h3>
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              className="border border-blue-200 rounded-lg px-3 py-2 text-sm flex-1 focus:ring-2 focus:ring-blue-100"
              placeholder="Thêm thể loại"
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddGenre()}
            />
            <Button
              size="sm"
              className="bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200"
              onClick={handleAddGenre}
            >
              <FaPlus />
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <tbody>
                {genreTags.map((tag) =>
                  editingGenreId === tag.id ? (
                    <tr key={tag.id} className="whitespace-nowrap">
                      <td className="pr-2 py-1">
                        <input
                          className="border border-blue-200 rounded-lg px-2 py-1 text-sm w-full"
                          value={editGenre}
                          onChange={(e) => setEditGenre(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSaveGenre()}
                        />
                      </td>
                      <td className="flex gap-2 py-1">
                        <Button size="sm" className="bg-green-100" onClick={handleSaveGenre}><FaSave /></Button>
                        <Button size="sm" className="bg-gray-200" onClick={() => setEditingGenreId(0)}><FaTimes /></Button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={tag.id} className="whitespace-nowrap">
                      <td className="pr-2 py-1">{tag.name}</td>
                      <td className="flex gap-2 py-1">
                        <Button size="sm" className="bg-yellow-100" onClick={() => handleEditGenre(tag)}><FaEdit /></Button>
                        <Button size="sm" className="bg-red-100" onClick={() => handleDeleteGenre(tag.id)}><FaTrash /></Button>
                      </td>
                    </tr>
                  )
                )}
                {genreTags.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-4 text-center text-gray-400">Không có thể loại nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Player Tags */}
        <section className={sectionStyles}>
          <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-700">
            <FaUsers className={iconStyles} /> Số người chơi
          </h3>
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              className="border border-blue-200 rounded-lg px-3 py-2 text-sm flex-1 focus:ring-2 focus:ring-blue-100"
              placeholder="Thêm số người chơi (VD: 2-4, 1-8, Solo)"
              value={newPlayers}
              onChange={(e) => setNewPlayers(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddPlayers()}
            />
            <Button
              size="sm"
              className="bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200"
              onClick={handleAddPlayers}
            >
              <FaPlus />
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <tbody>
                {playerTags.map((tag) =>
                  editingPlayerId === tag.id ? (
                    <tr key={tag.id} className="whitespace-nowrap">
                      <td className="pr-2 py-1">
                        <input
                          className="border border-blue-200 rounded-lg px-2 py-1 text-sm w-full"
                          value={editPlayers}
                          onChange={(e) => setEditPlayers(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSavePlayers()}
                        />
                      </td>
                      <td className="flex gap-2 py-1">
                        <Button size="sm" className="bg-green-100" onClick={handleSavePlayers}><FaSave /></Button>
                        <Button size="sm" className="bg-gray-200" onClick={() => setEditingPlayerId(0)}><FaTimes /></Button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={tag.id} className="whitespace-nowrap">
                      <td className="pr-2 py-1">{tag.name}</td>
                      <td className="flex gap-2 py-1">
                        <Button size="sm" className="bg-yellow-100" onClick={() => handleEditPlayers(tag)}><FaEdit /></Button>
                        <Button size="sm" className="bg-red-100" onClick={() => handleDeletePlayers(tag.id)}><FaTrash /></Button>
                      </td>
                    </tr>
                  )
                )}
                {playerTags.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-4 text-center text-gray-400">Không có số người chơi nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Duration Tags */}
        <section className={sectionStyles}>
          <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-700">
            <FaClock className={iconStyles} /> Thời lượng chơi
          </h3>
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              className="border border-blue-200 rounded-lg px-3 py-2 text-sm flex-1 focus:ring-2 focus:ring-blue-100"
              placeholder="Thêm thời lượng (VD: Ngắn, 30-60 phút, Dài)"
              value={newDuration}
              onChange={(e) => setNewDuration(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddDuration()}
            />
            <Button
              size="sm"
              className="bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200"
              onClick={handleAddDuration}
            >
              <FaPlus />
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <tbody>
                {durationTags.map((tag) =>
                  editingDurationId === tag.id ? (
                    <tr key={tag.id} className="whitespace-nowrap">
                      <td className="pr-2 py-1">
                        <input
                          className="border border-blue-200 rounded-lg px-2 py-1 text-sm w-full"
                          value={editDuration}
                          onChange={(e) => setEditDuration(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSaveDuration()}
                        />
                      </td>
                      <td className="flex gap-2 py-1">
                        <Button size="sm" className="bg-green-100" onClick={handleSaveDuration}><FaSave /></Button>
                        <Button size="sm" className="bg-gray-200" onClick={() => setEditingDurationId(0)}><FaTimes /></Button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={tag.id} className="whitespace-nowrap">
                      <td className="pr-2 py-1">{tag.name}</td>
                      <td className="flex gap-2 py-1">
                        <Button size="sm" className="bg-yellow-100" onClick={() => handleEditDuration(tag)}><FaEdit /></Button>
                        <Button size="sm" className="bg-red-100" onClick={() => handleDeleteDuration(tag.id)}><FaTrash /></Button>
                      </td>
                    </tr>
                  )
                )}
                {durationTags.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-4 text-center text-gray-400">Không có thời lượng nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Age Tags */}
        <section className={sectionStyles}>
          <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-700">
            <FaChild className={iconStyles} /> Độ tuổi
          </h3>
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              className="border border-blue-200 rounded-lg px-3 py-2 text-sm flex-1 focus:ring-2 focus:ring-blue-100"
              placeholder="Thêm độ tuổi (VD: 8+, 12+, Mọi lứa tuổi)"
              value={newAge}
              onChange={(e) => setNewAge(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddAge()}
            />
            <Button
              size="sm"
              className="bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200"
              onClick={handleAddAge}
            >
              <FaPlus />
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <tbody>
                {ageTags.map((tag) =>
                  editingAgeId === tag.id ? (
                    <tr key={tag.id} className="whitespace-nowrap">
                      <td className="pr-2 py-1">
                        <input
                          className="border border-blue-200 rounded-lg px-2 py-1 text-sm w-full"
                          value={editAge}
                          onChange={(e) => setEditAge(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSaveAge()}
                        />
                      </td>
                      <td className="flex gap-2 py-1">
                        <Button size="sm" className="bg-green-100" onClick={handleSaveAge}><FaSave /></Button>
                        <Button size="sm" className="bg-gray-200" onClick={() => setEditingAgeId(0)}><FaTimes /></Button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={tag.id} className="whitespace-nowrap">
                      <td className="pr-2 py-1">{tag.name}</td>
                      <td className="flex gap-2 py-1">
                        <Button size="sm" className="bg-yellow-100" onClick={() => handleEditAge(tag)}><FaEdit /></Button>
                        <Button size="sm" className="bg-red-100" onClick={() => handleDeleteAge(tag.id)}><FaTrash /></Button>
                      </td>
                    </tr>
                  )
                )}
                {ageTags.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-4 text-center text-gray-400">Không có độ tuổi nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-bold mb-4 text-red-700 flex items-center gap-3">
          <FaRecycle className="text-green-500" /> Khôi phục thẻ đã xóa
        </h3>
        {loadingDeleted ? (
          <Loading />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm rounded-xl overflow-hidden shadow border border-red-100 bg-white">
              <thead>
                <tr className="bg-gradient-to-r from-red-100 via-red-50 to-green-50 text-red-700">
                  <th className="py-3 px-4 font-semibold text-left">Tên thẻ</th>
                  <th className="py-3 px-4 font-semibold text-left">Loại</th>
                  <th className="py-3 px-4 font-semibold text-left">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {deletedTags.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-400 font-semibold">
                      <FaTrash className="inline-block mr-2 text-xl text-gray-300" />
                      Không có thẻ đã xóa.
                    </td>
                  </tr>
                ) : (
                  deletedTags.map(tag => (
                    <tr
                      key={tag.id}
                      className="whitespace-nowrap transition hover:bg-green-50"
                    >
                      <td className="pr-2 py-2 font-medium text-red-700">{tag.name}</td>
                      <td className="pr-2 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold
                          ${tag.type === "genre" ? "bg-blue-50 text-blue-700"
                            : tag.type === "players" ? "bg-yellow-50 text-yellow-700"
                            : tag.type === "duration" ? "bg-purple-50 text-purple-700"
                            : tag.type === "age" ? "bg-pink-50 text-pink-700"
                            : "bg-gray-100 text-gray-700"
                          }`}>
                          {tag.type === "genre" ? "Thể loại"
                            : tag.type === "players" ? "Số người chơi"
                            : tag.type === "duration" ? "Thời lượng"
                            : tag.type === "age" ? "Độ tuổi"
                            : tag.type}
                        </span>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-200 hover:from-green-200 hover:to-green-300 px-4 py-1 rounded-lg shadow transition flex items-center gap-2"
                          onClick={async () => {
                            await restoreTag(tag.id);
                            await refetchDeleted();
                            await refetch();
                          }}
                        >
                          <FaRecycle className="mr-1" /> Khôi phục
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {deletedTags.length > 0 && (
              <div className="mt-4 flex items-center gap-2 text-green-700 text-sm">
                <FaRecycle className="text-green-500" />
                Nhấn <span className="font-semibold">Khôi phục</span> để phục hồi thẻ đã xóa.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 text-gray-500 text-sm text-center">
        <strong>Mẹo:</strong> Quản lý thể loại, số người chơi, thời lượng và độ tuổi riêng biệt. Các thẻ này sẽ được dùng để gán cho boardgame ở trang Sản phẩm.
      </div>
    </div>
  );
};

export default TagsPage;