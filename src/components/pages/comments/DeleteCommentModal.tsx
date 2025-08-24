import { Button } from "../../widgets/button";
import type { RefObject } from "react";

export interface DeleteCommentModalProps {
  modalRef: RefObject<HTMLDivElement>;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

const DeleteCommentModal = ({
  modalRef,
  onCancel,
  onConfirm,
  loading,
}: DeleteCommentModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div
      ref={modalRef}
      className="bg-white rounded-xl shadow-lg max-w-sm w-full p-8 relative"
    >
      <h3 className="text-lg font-bold mb-4 text-red-600">Xóa bình luận</h3>
      <p className="mb-4">
        Bạn có chắc chắn muốn xóa bình luận này?
        <br />
        <span className="text-sm text-gray-500">Hành động này không thể hoàn tác.</span>
      </p>
      <div className="flex justify-end gap-2">
        <Button
          className="bg-gray-200 px-6 py-2 rounded"
          type="button"
          onClick={onCancel}
        >
          Hủy
        </Button>
        <Button
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
          type="button"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Đang xóa..." : "Xóa"}
        </Button>
      </div>
    </div>
  </div>
);

export default DeleteCommentModal;