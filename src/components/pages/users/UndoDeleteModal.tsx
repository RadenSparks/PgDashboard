import React from "react";
import { Button } from "../../widgets/button";
import { FaUndo } from "react-icons/fa";
import type { User } from "../../../redux/api/usersApi";

interface UndoDeleteModalProps {
  pendingDelete: { user: User; timeLeft: number } | null;
  UNDO_TIMEOUT: number;
  onUndo: () => void;
  onToast?: (opts: { title: string; description: string; status: "success" | "info" | "error" }) => void;
}

const UndoDeleteModal: React.FC<UndoDeleteModalProps> = ({
  pendingDelete,
  UNDO_TIMEOUT,
  onUndo,
  onToast,
}) => {
  if (!pendingDelete) return null;

  // Handler for Undo button
  const handleUndo = () => {
    onUndo();
    onToast?.({
      title: "Hoàn tác xóa",
      description: `Người dùng "${pendingDelete.user.full_name}" đã không bị xóa.`,
      status: "info",
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white border-4 border-red-600 text-red-700 px-8 py-8 rounded-2xl shadow-2xl flex flex-col min-w-[340px] max-w-xs w-full items-center animate-pulse">
        <div className="flex items-center justify-between w-full mb-4">
          <span className="font-bold text-lg flex-1 text-center">
            Deleting <b>{pendingDelete.user.full_name}</b>
          </span>
          <Button
            size="sm"
            className="bg-red-600 text-white border border-red-700 hover:bg-red-700 px-4 py-2 rounded ml-4"
            onClick={handleUndo}
          >
            <FaUndo className="inline mr-1" />
            Undo
          </Button>
        </div>
        <div className="w-full h-3 bg-red-200 rounded overflow-hidden mb-2">
          <div
            className="h-full bg-red-500"
            style={{
              width: `${(pendingDelete.timeLeft / UNDO_TIMEOUT) * 100}%`,
              transition: "width 0.1s linear",
            }}
          />
        </div>
        <div className="text-center text-base font-semibold mt-2">
          User will be deleted in&nbsp;
          <span className="font-mono text-lg">
            {(pendingDelete.timeLeft / 1000).toFixed(1)}s
          </span>
        </div>
      </div>
    </div>
  );
};

export default UndoDeleteModal;