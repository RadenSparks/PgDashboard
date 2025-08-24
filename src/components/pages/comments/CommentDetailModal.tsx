import { Button } from "../../widgets/button";
import * as CommentTable from "./CommentTable";
import react from "react";

type CommentDetailModalProps = {
  comment: CommentTable.Comment | undefined;
  modalRef: react.RefObject<HTMLDivElement>;
  onClose: () => void;
};

const CommentDetailModal = ({ comment, modalRef, onClose }: CommentDetailModalProps) => {
  if (!comment) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 relative"
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
          aria-label="Đóng"
        >
          &times;
        </button>
        <h3 className="text-lg font-bold mb-4">Chi tiết bình luận</h3>
        <div className="mb-2 text-yellow-600 font-semibold">
          Đánh giá: {comment.rating ?? "-"}
        </div>
        <div className="mb-4 text-gray-700 whitespace-pre-line">
          {comment.content}
        </div>
        <div className="flex justify-end">
          <Button
            className="bg-gray-200 px-6 py-2 rounded"
            type="button"
            onClick={onClose}
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentDetailModal;