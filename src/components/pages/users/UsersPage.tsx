import { useState, useRef, useEffect } from "react";
import { Button } from "../../widgets/button";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

type User = {
  id: number;
  full_name: string;
  username: string;
  password: string;
  phone_number: string;
  address: string;
  avatar_url: string;
  email: string;
  role: string;
  status: string;
};

const mockUsers: User[] = [
  {
    id: 1,
    full_name: "Admin User",
    username: "admin",
    password: "",
    phone_number: "1234567890",
    address: "123 Admin St",
    avatar_url: "",
    email: "admin@email.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    full_name: "John Doe",
    username: "johndoe",
    password: "",
    phone_number: "0987654321",
    address: "456 John St",
    avatar_url: "",
    email: "john@email.com",
    role: "User",
    status: "Active",
  },
  {
    id: 3,
    full_name: "Jane Doe",
    username: "janedoe",
    password: "",
    phone_number: "1112223333",
    address: "789 Jane St",
    avatar_url: "",
    email: "jane@email.com",
    role: "User",
    status: "Suspended",
  },
];

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

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Modal outside click close
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!showModal) return;
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowModal(false);
        setEditUser(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showModal]);

  const handleAdd = () => {
    setEditUser({ ...emptyUser, id: Date.now() });
    setShowModal(true);
  };

  const handleEdit = (id: number) => {
    const user = users.find(u => u.id === id);
    if (user) {
      setEditUser({ ...user });
      setShowModal(true);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      setUsers(users.filter(u => u.id !== deleteId));
      setDeleteId(null);
    }
  };

  const cancelDelete = () => setDeleteId(null);

  const handleSave = () => {
    if (!editUser) return;
    if (editUser.id && users.some(u => u.id === editUser.id)) {
      // Update
      setUsers(users.map(u => (u.id === editUser.id ? editUser : u)));
    } else {
      // Add
      setUsers([{ ...editUser, id: Date.now() }, ...users]);
    }
    setShowModal(false);
    setEditUser(null);
  };

  const handleChange = (field: keyof User, value: string) => {
    if (!editUser) return;
    setEditUser({ ...editUser, [field]: value });
  };

  const handleStatusToggle = (id: number) => {
    setUsers(users =>
      users.map(u =>
        u.id === id
          ? {
              ...u,
              status: u.status === "Active" ? "Suspended" : "Active",
            }
          : u
      )
    );
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users</h2>
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-2"
          onClick={handleAdd}
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
              {users.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
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
                      className="bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200"
                      onClick={() => handleEdit(user.id)}
                    >
                      <FaEdit className="inline mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-100 text-red-700 border border-red-300 hover:bg-red-200"
                      onClick={() => handleDelete(user.id)}
                    >
                      <FaTrash className="inline mr-1" />
                      Delete
                    </Button>
                    <Button
                      size="sm"
                      className={
                        user.status === "Active"
                          ? "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                          : "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200"
                      }
                      onClick={() => handleStatusToggle(user.id)}
                    >
                      {user.status === "Active" ? "Set Inactive" : "Set Active"}
                    </Button>
                  </td>
                </tr>
              ))}
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

      {/* Add/Edit Modal */}
      {showModal && editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative"
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => {
                setShowModal(false);
                setEditUser(null);
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">
              {users.some(u => u.id === editUser.id) ? "Edit User" : "Add User"}
            </h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={editUser.full_name}
                  onChange={e => handleChange("full_name", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={editUser.username}
                  onChange={e => handleChange("username", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  type="password"
                  value={editUser.password}
                  onChange={e => handleChange("password", e.target.value)}
                  required={!users.some(u => u.id === editUser.id)}
                  placeholder={users.some(u => u.id === editUser.id) ? "Leave blank to keep current" : ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={editUser.phone_number}
                  onChange={e => handleChange("phone_number", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={editUser.address}
                  onChange={e => handleChange("address", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Avatar URL</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={editUser.avatar_url}
                  onChange={e => handleChange("avatar_url", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  type="email"
                  value={editUser.email}
                  onChange={e => handleChange("email", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={editUser.role}
                  onChange={e => handleChange("role", e.target.value)}
                >
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
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
                  onClick={() => {
                    setShowModal(false);
                    setEditUser(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-8 relative">
            <h3 className="text-lg font-bold mb-4 text-red-600">Delete User</h3>
            <p className="mb-4">
              Are you sure you want to delete this user?
              <br />
              <span className="text-sm text-gray-500">This action cannot be undone.</span>
            </p>
            <div className="flex justify-end gap-2">
              <Button
                className="bg-gray-200 px-6 py-2 rounded"
                type="button"
                onClick={cancelDelete}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                type="button"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;