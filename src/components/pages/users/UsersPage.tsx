import { useState, useEffect } from "react";
import { Button } from "../../widgets/button";
import { FaTrash, FaPlus, FaUndo } from "react-icons/fa";
import clsx from "clsx";
import type { User } from "../users/usersData"; 
type UsersPageProps = {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

const UNDO_TIMEOUT = 8000; // 8 seconds

const emptyUser: User = {
  id: 0,
  full_name: "",
  username: "",
  password: "",
  phone_number: "",
  address: "",
  avatar_url: "",
  email: "",
  role: "User",
  status: "Active",
};

const UsersPage = ({ users, setUsers }: UsersPageProps) => {
  const [pendingDelete, setPendingDelete] = useState<{ user: User; timeLeft: number } | null>(null);
  const [fadingUserId, setFadingUserId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState<User>({ ...emptyUser });

  // Handle delete timer and fade-out
  useEffect(() => {
    if (!pendingDelete) return;
    const fadeOutTime = UNDO_TIMEOUT * 0.8;
    let fadeTimeout: NodeJS.Timeout | null = null;
    let interval: NodeJS.Timeout | null = null;
    let timeout: NodeJS.Timeout | null = null;

    fadeTimeout = setTimeout(() => {
      setFadingUserId(pendingDelete.user.id);
    }, fadeOutTime);

    interval = setInterval(() => {
      setPendingDelete(prev =>
        prev ? { ...prev, timeLeft: prev.timeLeft - 100 } : null
      );
    }, 100);

    timeout = setTimeout(() => {
      setUsers(prev => prev.filter(u => u.id !== pendingDelete.user.id));
      setPendingDelete(null);
      setFadingUserId(null);
    }, pendingDelete.timeLeft);

    return () => {
      if (fadeTimeout) clearTimeout(fadeTimeout);
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [pendingDelete?.user.id, setUsers, pendingDelete]);

  const handleDelete = (id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    // Prevent deleting users with the Admin role
    if (user.role === "Admin") return;
    setPendingDelete({ user, timeLeft: UNDO_TIMEOUT });
    setFadingUserId(null);
  };

  const handleUndoDelete = () => {
    setPendingDelete(null);
    setFadingUserId(null);
  };

  // Add user modal logic
  const handleAddUser = () => {
    setShowAddModal(true);
    setNewUser({ ...emptyUser, id: Date.now() });
  };

  const handleSaveNewUser = () => {
    setUsers(prev => [{ ...newUser, id: Date.now(), role: "User" }, ...prev]);
    setShowAddModal(false);
    setNewUser({ ...emptyUser });
  };

  const handleChangeNewUser = (field: keyof User, value: string) => {
    setNewUser(prev => ({ ...prev, [field]: value }));
  };

  // Toggle user status (Active/Suspended)
  const handleToggleStatus = (id: number) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" }
          : u
      )
    );
  };

  // Show all users, but highlight the one being deleted
  const visibleUsers = users;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users</h2>
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-2"
          onClick={handleAddUser}
        >
          <FaPlus />
          Add User
        </Button>
      </div>
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
              {visibleUsers.map(user => {
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
                          user.status === "Active"
                            ? "text-green-600 font-semibold"
                            : "text-red-600 font-semibold"
                        }
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-2 px-2 flex gap-2">
                      <Button
                        size="sm"
                        className={
                          user.status === "Active"
                            ? "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                            : "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200"
                        }
                        onClick={() => handleToggleStatus(user.id)}
                        disabled={!!pendingDelete}
                      >
                        {user.status === "Active" ? "Set Suspended" : "Set Active"}
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-100 text-red-700 border border-red-300 hover:bg-red-200"
                        onClick={() => handleDelete(user.id)}
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
              {visibleUsers.length === 0 && (
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

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setShowAddModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">Add User</h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSaveNewUser();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={newUser.full_name}
                  onChange={e => handleChangeNewUser("full_name", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={newUser.username}
                  onChange={e => handleChangeNewUser("username", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  type="password"
                  value={newUser.password}
                  onChange={e => handleChangeNewUser("password", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={newUser.phone_number}
                  onChange={e => handleChangeNewUser("phone_number", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={newUser.address}
                  onChange={e => handleChangeNewUser("address", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Avatar URL</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={newUser.avatar_url}
                  onChange={e => handleChangeNewUser("avatar_url", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  type="email"
                  value={newUser.email}
                  onChange={e => handleChangeNewUser("email", e.target.value)}
                  required
                />
              </div>
              {/* Role is not selectable, always "User" */}
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <input
                  className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500"
                  value="User"
                  disabled
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={newUser.status}
                  onChange={e => handleChangeNewUser("status", e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  type="submit"
                >
                  Save
                </Button>
                <Button
                  className="bg-gray-200 px-6 py-2 rounded"
                  type="button"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Undo Delete Snackbar as Modal */}
      {pendingDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white border-4 border-red-600 text-red-700 px-8 py-8 rounded-2xl shadow-2xl flex flex-col min-w-[340px] max-w-xs w-full items-center animate-pulse">
            <div className="flex items-center justify-between w-full mb-4">
              <span className="font-bold text-lg flex-1 text-center">
                Deleting <b>{pendingDelete.user.full_name}</b>
              </span>
              <Button
                size="sm"
                className="bg-red-600 text-white border border-red-700 hover:bg-red-700 px-4 py-2 rounded ml-4"
                onClick={handleUndoDelete}
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
      )}
      <div className="mt-6 text-gray-500 text-sm">
        <strong>Note:</strong> User information is managed and updated from the main site. You cannot edit user info here. Any changes will be reflected automatically when updated on the main site.
      </div>
    </div>
  );
};

export default UsersPage;