import React from "react";

interface DeleteFolderModalProps {
  show: boolean;
  deleting: boolean;
  onCancel: () => void;
  onDelete: () => void;
}

const DeleteFolderModal: React.FC<DeleteFolderModalProps> = ({
  show,
  deleting,
  onCancel,
  onDelete,
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-8 relative">
        <h3 className="text-lg font-bold mb-4 text-red-600">Xóa thư mục</h3>
        <p className="mb-4">
          Bạn có chắc chắn muốn xóa thư mục này và toàn bộ ảnh bên trong?
          <br />
          <span className="text-sm text-gray-500">Hành động này không thể hoàn tác.</span>
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

export default DeleteFolderModal;