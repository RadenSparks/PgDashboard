import React from "react";
import { Button } from "../../widgets/button";
import { FaExclamationTriangle } from "react-icons/fa";

type DeleteVoucherModalProps = {
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const DeleteVoucherModal: React.FC<DeleteVoucherModalProps> = ({
  show,
  onCancel,
  onConfirm,
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-8 relative">
        <div className="flex items-center gap-3 mb-4">
          <FaExclamationTriangle className="text-red-500 text-2xl" />
          <h3 className="text-lg font-bold text-red-600">Xóa Voucher</h3>
        </div>
        <p className="mb-4">
          Bạn có chắc chắn muốn xóa voucher này không?
          <br />
          <span className="text-sm text-gray-500">Hành động này không thể hoàn tác.</span>
        </p>
        <div className="flex justify-end gap-2">
          <Button
            className="bg-gray-200 px-6 py-2 rounded hover:bg-gray-300"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 shadow"
            type="button"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteVoucherModal;