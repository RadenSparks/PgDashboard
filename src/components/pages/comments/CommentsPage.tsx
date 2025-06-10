import { useState, useRef, useEffect } from "react";
import { Button } from "../../widgets/button";
import { FaTrash } from "react-icons/fa";

type Comment = {
  id: number;
  productId: number;
  productName: string;
  user: string;
  content: string;
  date: string;
  status: "Visible" | "Hidden";
};

const mockComments: Comment[] = [
  {
    id: 1,
    productId: 101,
    productName: "Product A",
    user: "Alice",
    content:
      "Great product! This is a very long comment to demonstrate the view detail button. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "2025-06-01",
    status: "Visible",
  },
  {
    id: 2,
    productId: 102,
    productName: "Product B",
    user: "Bob",
    content: "Not what I expected.",
    date: "2025-06-02",
    status: "Hidden",
  },
];

const MAX_COMMENT_LENGTH = 50;

const CommentsPage = () => {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewDetailId, setViewDetailId] = useState<number | null>(null);

  // Modal outside click close
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (deleteId === null && viewDetailId === null) return;
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setDeleteId(null);
        setViewDetailId(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [deleteId, viewDetailId]);

  const handleDelete = (id: number) => setDeleteId(id);

  const confirmDelete = () => {
    if (deleteId !== null) {
      setComments(comments.filter(c => c.id !== deleteId));
      setDeleteId(null);
    }
  };

  const cancelDelete = () => setDeleteId(null);

  const handleToggleStatus = (id: number) => {
    setComments(comments =>
      comments.map(c =>
        c.id === id
          ? { ...c, status: c.status === "Visible" ? "Hidden" : "Visible" }
          : c
      )
    );
  };

  const handleViewDetail = (id: number) => setViewDetailId(id);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Product Comments</h2>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 px-2">Product</th>
                <th className="py-2 px-2">User</th>
                <th className="py-2 px-2">Comment</th>
                <th className="py-2 px-2">Date</th>
                <th className="py-2 px-2">Status</th>
                <th className="py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.map(comment => (
                <tr key={comment.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2">{comment.productName}</td>
                  <td className="py-2 px-2">{comment.user}</td>
                  <td className="py-2 px-2">
                    {comment.content.length > MAX_COMMENT_LENGTH
                      ? `${comment.content.slice(0, MAX_COMMENT_LENGTH)}...`
                      : comment.content}
                  </td>
                  <td className="py-2 px-2">{comment.date}</td>
                  <td className="py-2 px-2">
                    <span
                      className={
                        comment.status === "Visible"
                          ? "text-green-600 font-semibold"
                          : "text-gray-500 font-semibold"
                      }
                    >
                      {comment.status}
                    </span>
                  </td>
                  <td className="py-2 px-2 flex gap-2">
                    {comment.content.length > MAX_COMMENT_LENGTH && (
                      <Button
                        size="sm"
                        className="px-2 py-0.5 bg-blue-100 text-blue-700 border border-blue-200 rounded text-xs"
                        onClick={() => handleViewDetail(comment.id)}
                      >
                        View Detail
                      </Button>
                    )}
                    <Button
                      size="sm"
                      className={
                        comment.status === "Visible"
                          ? "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                          : "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200"
                      }
                      onClick={() => handleToggleStatus(comment.id)}
                    >
                      {comment.status === "Visible" ? "Hide" : "Show"}
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-100 text-red-700 border border-red-300 hover:bg-red-200"
                      onClick={() => handleDelete(comment.id)}
                    >
                      <FaTrash className="inline mr-1" />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              {comments.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-400">
                    No comments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Detail Modal */}
      {viewDetailId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 relative"
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setViewDetailId(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Comment Detail</h3>
            <div className="mb-4 text-gray-700 whitespace-pre-line">
              {comments.find(c => c.id === viewDetailId)?.content}
            </div>
            <div className="flex justify-end">
              <Button
                className="bg-gray-200 px-6 py-2 rounded"
                type="button"
                onClick={() => setViewDetailId(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-lg max-w-sm w-full p-8 relative"
          >
            <h3 className="text-lg font-bold mb-4 text-red-600">Delete Comment</h3>
            <p className="mb-4">
              Are you sure you want to delete this comment?
              <br />
              <span className="text-sm text-gray-500">This action cannot be undone.</span>
            </p>
            <div className="flex justify-end gap-2">
              <Button
                className="bg-gray-200 px-6 py-2 rounded"
                type="button"
                onClick={cancelDelete}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                type="button"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsPage;