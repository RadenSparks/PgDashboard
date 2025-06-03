import { useState } from "react";
import { Button } from "../../widgets/button";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const mockUsers = [
  {
    id: 1,
    username: "admin",
    email: "admin@email.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    username: "johndoe",
    email: "john@email.com",
    role: "User",
    status: "Active",
  },
  {
    id: 3,
    username: "janedoe",
    email: "jane@email.com",
    role: "User",
    status: "Suspended",
  },
];

const UsersPage = () => {
  const [users, setUsers] = useState(mockUsers);

  const handleEdit = (id: number) => {
    // TODO: Open edit modal or navigate to edit page
    alert(`Edit user with id ${id}`);
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleAdd = () => {
    // TODO: Open add user modal or navigate to add user page
    alert("Add new user");
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
                <th className="py-2 px-2">Username</th>
                <th className="py-2 px-2">Email</th>
                <th className="py-2 px-2">Role</th>
                <th className="py-2 px-2">Status</th>
                <th className="py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2">{user.username}</td>
                  <td className="py-2 px-2">{user.email}</td>
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
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;