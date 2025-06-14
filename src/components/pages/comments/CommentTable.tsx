import { Button } from "../../widgets/button";
import { FaTrash } from "react-icons/fa";

export type Comment = {
  id: number;
  productId: number;
  productName: string;
  user: string;
  content: string;
  date: string;
  status: "Visible" | "Hidden";
};

type CommentTableProps = {
  comments: Comment[];
  maxCommentLength: number;
  onViewDetail: (id: number) => void;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
};

const CommentTable = ({
  comments,
  maxCommentLength,
  onViewDetail,
  onToggleStatus,
  onDelete,
}: CommentTableProps) => (
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
              {comment.content.length > maxCommentLength
                ? `${comment.content.slice(0, maxCommentLength)}...`
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
              {comment.content.length > maxCommentLength && (
                <Button
                  size="sm"
                  className="px-2 py-0.5 bg-blue-100 text-blue-700 border border-blue-200 rounded text-xs"
                  onClick={() => onViewDetail(comment.id)}
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
                onClick={() => onToggleStatus(comment.id)}
              >
                {comment.status === "Visible" ? "Hide" : "Show"}
              </Button>
              <Button
                size="sm"
                className="bg-red-100 text-red-700 border border-red-300 hover:bg-red-200"
                onClick={() => onDelete(comment.id)}
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
);

export default CommentTable;