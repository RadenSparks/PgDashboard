import React from "react";
import { Button } from "../../widgets/button";
import { FaTrash } from "react-icons/fa";
import clsx from "clsx";
import type { User } from "../users/usersData";

interface UsersTableProps {
  users: User[];
  fadingUserId: number | null;
  pendingDelete: { user: User; timeLeft: number } | null;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  fadingUserId,
  pendingDelete,
  onToggleStatus,
  onDelete,
}) => (
  <div className="bg-white rounded-xl shadow p-6">
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2 px-2">Avatar</th>
            <th className="py-2 px-2">Full Name</th>
            <th className="py-2 px-2">Username</th>
            <th className="py-2 px-2">Email</th>
            <th className="py-2 px-2">Phone</th>
            <th className="py-2 px-2">Address</th>
            <th className="py-2 px-2">Role</th>
            <th className="py-2 px-2">Status</th>
            <th className="py-2 px-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => {
            const isFading = fadingUserId === user.id;
            const isPendingDelete = pendingDelete?.user.id === user.id;
            return (
              <tr
                key={user.id}
                className={clsx(
                  "border-b transition-all duration-700",
                  isPendingDelete && !isFading && "bg-red-100 ring-2 ring-red-400",
                  isFading && "opacity-0 pointer-events-none"
                )}
                style={{
                  transition: "opacity 1s, background 0.3s",
                }}
              >
                <td className="py-2 px-2">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="w-10 h-10 object-cover rounded-full border"
                    />
                  ) : (
                    <span className="inline-block w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
                      {user.full_name ? user.full_name[0].toUpperCase() : "?"}
                    </span>
                  )}
                </td>
                <td className="py-2 px-2">{user.full_name}</td>
                <td className="py-2 px-2">{user.username}</td>
                <td className="py-2 px-2">{user.email}</td>
                <td className="py-2 px-2">{user.phone_number}</td>
                <td className="py-2 px-2">{user.address}</td>
                <td className="py-2 px-2">{user.role}</td>
                <td className="py-2 px-2">
                  <span
                    className={
                      user.status
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }
                  >
                    {user.status ? "Active" : "Suspended"}
                  </span>
                </td>
                <td className="py-2 px-2 flex gap-2">
                  <Button
                    size="sm"
                    className={
                      user.status
                        ? "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                        : "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200"
                    }
                    onClick={() => onToggleStatus(user.id)}
                    disabled={!!pendingDelete}
                  >
                    {user.status ? "Set Suspended" : "Set Active"}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-100 text-red-700 border border-red-300 hover:bg-red-200"
                    onClick={() => onDelete(user.id)}
                    disabled={!!pendingDelete || user.role === "Admin"}
                    title={user.role === "Admin" ? "Cannot delete Admin users" : "Delete"}
                  >
                    <FaTrash className="inline mr-1" />
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
          {users.length === 0 && (
            <tr>
              <td colSpan={9} className="py-6 text-center text-gray-400">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default UsersTable;