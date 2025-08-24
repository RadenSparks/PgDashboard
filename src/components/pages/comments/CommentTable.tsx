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
  rating?: number;
};

type CommentTableProps = {
  comments: Comment[];
  maxCommentLength: number;
  onViewDetail: (id: number) => void;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
  actionLoading?: boolean;
};

const CommentTable = ({
  comments,
  maxCommentLength,
  onViewDetail,
  onToggleStatus,
  onDelete,
  actionLoading,
}: CommentTableProps) => (
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm border-separate border-spacing-y-2">
      <thead>
        <tr className="text-left border-b bg-blue-50">
          <th className="py-2 px-2 rounded-tl-lg">Sản phẩm</th>
          <th className="py-2 px-2">Người dùng</th>
          <th className="py-2 px-2">Bình luận</th>
          <th className="py-2 px-2">Ngày</th>
          <th className="py-2 px-2">Trạng thái</th>
          <th className="py-2 px-2">Thao tác</th>
          <th className="py-2 px-2 rounded-tr-lg">Đánh giá</th>
        </tr>
      </thead>
      <tbody>
        {comments.map(comment => (
          <tr key={comment.id} className="border-b hover:bg-blue-50 transition">
            <td className="py-2 px-2 font-semibold text-blue-900">{comment.productName}</td>
            <td className="py-2 px-2">{comment.user}</td>
            <td className="py-2 px-2">
              {comment.content.length > maxCommentLength
                ? `${comment.content.slice(0, maxCommentLength)}...`
                : comment.content}
              {comment.content.length > maxCommentLength && (
                <Button
                  size="sm"
                  className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 border border-blue-200 rounded text-xs"
                  onClick={() => onViewDetail(comment.id)}
                  disabled={actionLoading}
                >
                  Xem chi tiết
                </Button>
              )}
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
                {comment.status === "Visible" ? "Hiển thị" : "Ẩn"}
              </span>
            </td>
            <td className="py-2 px-2 flex gap-2">
              <Button
                size="sm"
                className={
                  comment.status === "Visible"
                    ? "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                    : "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200"
                }
                onClick={() => onToggleStatus(comment.id)}
                disabled={actionLoading}
              >
                {comment.status === "Visible" ? "Ẩn" : "Hiển thị"}
              </Button>
              <Button
                size="sm"
                className="bg-red-100 text-red-700 border border-red-300 hover:bg-red-200"
                onClick={() => onDelete(comment.id)}
                disabled={actionLoading}
              >
                <FaTrash className="inline mr-1" />
                Xóa
              </Button>
            </td>
            <td className="py-2 px-2">{comment.rating ?? "-"}</td>
          </tr>
        ))}
        {comments.length === 0 && (
          <tr>
            <td colSpan={7} className="py-6 text-center text-gray-400">
              Không tìm thấy bình luận nào.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default CommentTable;