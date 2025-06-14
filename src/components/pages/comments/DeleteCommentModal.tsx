import { Button } from "../../widgets/button";
import react from "react";

type DeleteCommentModalProps = {
  modalRef: react.RefObject<HTMLDivElement>;
  onCancel: () => void;
  onConfirm: () => void;
};

const DeleteCommentModal = ({ modalRef, onCancel, onConfirm }: DeleteCommentModalProps) => (
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
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
          type="button"
          onClick={onConfirm}
        >
          Delete
        </Button>
      </div>
    </div>
  </div>
);

export default DeleteCommentModal;