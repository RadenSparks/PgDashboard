import { useState, useRef, useEffect } from "react";
import CommentTable, * as CommentTable_1 from "./CommentTable";
import CommentDetailModal from "./CommentDetailModal";
import DeleteCommentModal from "./DeleteCommentModal";

const mockComments: CommentTable_1.Comment[] = [
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
  const [comments, setComments] = useState<CommentTable_1.Comment[]>(mockComments);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewDetailId, setViewDetailId] = useState<number | null>(null);

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
        <CommentTable
          comments={comments}
          maxCommentLength={MAX_COMMENT_LENGTH}
          onViewDetail={handleViewDetail}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      </div>

      {/* View Detail Modal */}
      {viewDetailId !== null && (
        <CommentDetailModal
          comment={comments.find(c => c.id === viewDetailId)}
          modalRef={modalRef}
          onClose={() => setViewDetailId(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <DeleteCommentModal
          modalRef={modalRef}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default CommentsPage;