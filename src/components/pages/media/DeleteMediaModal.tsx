import React from "react";
import type { MediaItem } from "../../../redux/api/mediaApi";

interface DeleteMediaModalProps {
  show: boolean;
  deleting: boolean;
  target: MediaItem | null;
  onCancel: () => void;
  onDelete: () => void;
}

const DeleteMediaModal: React.FC<DeleteMediaModalProps> = ({
  show,
  deleting,
  target,
  onCancel,
  onDelete,
}) => {
  if (!show || !target) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-8 relative">
        <h3 className="text-lg font-bold mb-4 text-red-600">Xóa ảnh</h3>
        <p className="mb-4">
          Bạn có chắc chắn muốn xóa{" "}
          <span className="font-semibold">{target.name}</span>?<br />
          <span className="text-sm text-gray-500">
            Hành động này không thể hoàn tác.
          </span>
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-200 px-6 py-2 rounded"
            type="button"
            onClick={onCancel}
            disabled={deleting}
          >
            Hủy
          </button>
          <button
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            type="button"
            onClick={onDelete}
            disabled={deleting}
          >
            {deleting ? "Đang xóa..." : "Xóa"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMediaModal;