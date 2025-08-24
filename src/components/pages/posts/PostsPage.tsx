import { useState, useRef } from "react";
import { Button } from "../../widgets/button";
import { IoMdAdd } from "react-icons/io";
import { useGetPostsQuery, useDeletePostMutation, type Post } from '../../../redux/postsApi';
import PostForm from "./PostForm";
import CatalogueManager from './CatalogueManager';
import BlogPostPreview from './BlogPostPreview';
import Loading from "../../widgets/loading";
import { toaster } from "../../widgets/toaster";
import UndoDeleteModal from "../users/UndoDeleteModal"; // Reuse the UndoDeleteModal

const UNDO_TIMEOUT = 3500; // ms

const PostsPage = () => {
  const { data: posts = [], refetch, isLoading } = useGetPostsQuery();
  const [deletePost] = useDeletePostMutation();
  const [previewPost, setPreviewPost] = useState<Post | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [showCatalogueManager, setShowCatalogueManager] = useState(false);

  // Undo delete state
  const [pendingDelete, setPendingDelete] = useState<{ post: Post; timeLeft: number } | null>(null);
  const undoTimer = useRef<NodeJS.Timeout | null>(null);

  // --- LOADING TRANSITION ---
  if (isLoading) return <Loading />;

  // --- Handle Delete with Undo ---
  const handleDelete = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    setPendingDelete({ post, timeLeft: UNDO_TIMEOUT });

    // Start countdown
    let timeLeft = UNDO_TIMEOUT;
    undoTimer.current = setInterval(() => {
      timeLeft -= 100;
      setPendingDelete(prev =>
        prev ? { ...prev, timeLeft: Math.max(0, timeLeft) } : null
      );
      if (timeLeft <= 0) {
        clearInterval(undoTimer.current!);
        confirmDelete(postId);
      }
    }, 100);
  };

  const confirmDelete = async (postId: number) => {
    setPendingDelete(null);
    try {
      await deletePost(postId).unwrap();
      toaster.show({
        title: "Đã xóa",
        description: "Bài viết đã được xóa thành công.",
        type: "success",
      });
      refetch();
    } catch {
      toaster.show({
        title: "Xóa thất bại",
        description: "Không thể xóa bài viết.",
        type: "error",
      });
    }
  };

  const handleUndo = () => {
    if (undoTimer.current) clearInterval(undoTimer.current);
    setPendingDelete(null);
    toaster.show({
      title: "Hoàn tác xóa",
      description: "Bài viết chưa bị xóa.",
      type: "info",
    });
  };

  // --- Handle Add/Update with Toast ---
  const handleFormSuccess = (action: "add" | "update") => {
    setShowForm(false);
    refetch();
    toaster.show({
      title: action === "add" ? "Đã tạo bài viết" : "Đã cập nhật bài viết",
      description: action === "add"
        ? "Bài viết đã được thêm thành công."
        : "Bài viết đã được cập nhật thành công.",
      type: "success",
    });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-800">Quản lý bài viết</h2>
        <div className="flex gap-2">
          <Button
            className="flex gap-2 px-4 py-2 bg-gray-100 text-blue-700 border border-blue-200 rounded-xl hover:bg-blue-50 transition font-semibold shadow"
            onClick={() => setShowCatalogueManager(true)}
          >
            <span>Quản lý danh mục</span>
          </Button>
          <Button
            className="flex gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold shadow"
            onClick={() => { setEditPost(null); setShowForm(true); }}
          >
            <IoMdAdd size={22} />
            <span>Thêm bài viết</span>
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="overflow-x-auto">
          <table className="min-w-full text-base">
            <thead>
              <tr className="text-left border-b bg-blue-50">
                <th className="py-3 px-3 font-semibold text-gray-700">Tiêu đề</th>
                <th className="py-3 px-3 font-semibold text-gray-700">Đường dẫn</th>
                <th className="py-3 px-3 font-semibold text-gray-700">Danh mục</th>
                <th className="py-3 px-3 font-semibold text-gray-700">Ngày tạo</th>
                <th className="py-3 px-3 font-semibold text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b hover:bg-blue-50 transition">
                  <td className="py-2 px-3 font-semibold text-gray-900">{post.name}</td>
                  <td className="py-2 px-3 text-blue-700">{post.canonical}</td>
                  <td className="py-2 px-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                      {typeof post.catalogue === 'object' && post.catalogue !== null && 'name' in post.catalogue
                        ? (post.catalogue as { name: string }).name
                        : '-'}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-gray-500">{post.created_at?.slice(0, 10)}</td>
                  <td className="py-2 px-3 flex gap-2">
                    <Button
                      size="sm"
                      className="bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 px-3 py-1 rounded-lg font-semibold"
                      onClick={() => setPreviewPost(post)}
                    >
                      Xem trước
                    </Button>
                    <Button
                      size="sm"
                      className="bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200 px-3 py-1 rounded-lg font-semibold"
                      onClick={() => { setEditPost(post); setShowForm(true); }}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 px-3 py-1 rounded-lg font-semibold"
                      onClick={() => handleDelete(post.id)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 text-lg">
                    Không tìm thấy bài viết nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Undo Delete Modal */}
      <UndoDeleteModal
        pendingDelete={
          pendingDelete
            ? {
                user: {
                  id: pendingDelete.post.id,
                  full_name: pendingDelete.post.name,
                  // Fill other User fields with dummy values if needed
                  email: "",
                  username: "",
                  avatar_url: "",
                  status: true,
                  role: "user",
                },
                timeLeft: pendingDelete.timeLeft,
              }
            : null
        }
        UNDO_TIMEOUT={UNDO_TIMEOUT}
        onUndo={handleUndo}
        onToast={({ title, description, status }) =>
          toaster.show({
            title,
            description,
            type: status,
          })
        }
      />

      {/* Catalogue Manager Modal */}
      {showCatalogueManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setShowCatalogueManager(false)}
              aria-label="Đóng quản lý danh mục"
            >
              &times;
            </button>
            <CatalogueManager />
          </div>
        </div>
      )}

      {/* Post Markdown Preview Modal */}
      {previewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full min-h-[70vh] p-0 relative overflow-hidden flex flex-col">
            <button
              className="absolute top-4 right-6 text-gray-400 hover:text-gray-700 text-3xl"
              onClick={() => setPreviewPost(null)}
              aria-label="Đóng xem trước"
            >
              &times;
            </button>
            <div className="w-full h-full flex flex-col">
              <BlogPostPreview
                content={previewPost?.content || ''}
                title={previewPost?.name}
                description={previewPost?.description}
                image={previewPost?.image}
                catalogueName={
                  typeof previewPost?.catalogue === 'object' &&
                  previewPost?.catalogue !== null &&
                  'name' in previewPost.catalogue
                    ? (previewPost.catalogue as { name: string }).name
                    : undefined
                }
                date={previewPost?.created_at?.slice(0, 10)}
                fontFamily={previewPost?.fontFamily}
                fontSize={previewPost?.fontSize}
                textColor={previewPost?.textColor}
                bgColor={previewPost?.bgColor}
                meta_title={previewPost?.meta_title}
                meta_description={previewPost?.meta_description}
                meta_keyword={previewPost?.meta_keyword}
                canonical={previewPost?.canonical}
                onApplySeo={() => {}}
                onContentGenerated={() => {}}
              />
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Post Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-8 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setShowForm(false)}
              aria-label="Đóng form"
            >
              &times;
            </button>
            <PostForm
              initialData={editPost ?? {}}
              onSuccess={() => handleFormSuccess(editPost ? "update" : "add")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsPage;
