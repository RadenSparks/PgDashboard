import React, { useState } from "react";
import { Button } from "../../widgets/button";
import {
    FaEdit,
    FaUserShield,
    FaUserEdit,
    FaUser,
    FaTrash,
    FaPlus,
} from "react-icons/fa";
import type { User } from "../users/usersData";

type Role = {
    id: number;
    name: string;
    permissions: {
        edit: boolean;
        delete: boolean;
        update: boolean;
    };
};

const mockRoles: Role[] = [
    {
        id: 1,
        name: "Admin",
        permissions: { edit: true, delete: true, update: true },
    },
    {
        id: 2,
        name: "Editor",
        permissions: { edit: true, delete: false, update: true },
    },
    {
        id: 3,
        name: "Viewer",
        permissions: { edit: false, delete: false, update: false },
    },
];

type PermissionPageProps = {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

const PermissionPage = ({ users, setUsers }: PermissionPageProps) => {
    const [roles, setRoles] = useState<Role[]>(mockRoles);
    const [editRoleId, setEditRoleId] = useState<number | null>(null);
    const [editPermissions, setEditPermissions] = useState<Role["permissions"]>({
        edit: false,
        delete: false,
        update: false,
    });
    const [addUserRole, setAddUserRole] = useState<"Admin" | "Editor" | "Viewer" | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const handleEdit = (role: Role) => {
        setEditRoleId(role.id);
        setEditPermissions(role.permissions);
    };

    const handleSave = () => {
        setRoles((prev) =>
            prev.map((role) =>
                role.id === editRoleId
                    ? { ...role, permissions: { ...editPermissions } }
                    : role
            )
        );
        setEditRoleId(null);
    };

    const handlePermissionChange = (
        perm: keyof Role["permissions"],
        value: boolean
    ) => {
        setEditPermissions((prev) => ({ ...prev, [perm]: value }));
    };

    const groupedUsers = {
        Admin: users.filter((u) => u.role === "Admin"),
        Editor: users.filter((u) => u.role === "Editor"),
        Viewer: users.filter((u) => u.role === "Viewer"),
    };

    // Remove unused handleChangeUserRole

    const handleDeleteUser = (userId: number) => {
        setUsers((prev: User[]) =>
          prev.map(u =>
            u.id === userId ? { ...u, role: "User" } : u
          )
        );
    };

    // Only allow adding users that already exist in users array and are not already in the role
    const availableUsersForRole = (role: "Admin" | "Editor" | "Viewer") =>
        users.filter(
            u =>
                u.role !== role &&
                (u.role === "User" || u.role === "" || u.role === undefined)
        );

    const filteredUsers = (role: "Admin" | "Editor" | "Viewer") =>
        availableUsersForRole(role).filter(
            u =>
                u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const handleAddUser = () => {
        if (!addUserRole || selectedUserId == null) return;
        setUsers((prev: User[]) =>
            prev.map(u =>
                u.id === selectedUserId ? { ...u, role: addUserRole } : u
            )
        );
        setAddUserRole(null);
        setSelectedUserId(null);
        setSearchTerm("");
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">
                Role & Permission Configuration
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Admins */}
                <div className="bg-white rounded-xl shadow p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <FaUserShield className="text-blue-600" />
                        <span className="font-semibold text-lg">Admins</span>
                    </div>
                    <ul>
                        {groupedUsers.Admin.length === 0 && (
                            <li className="text-gray-400 text-sm">No admins found.</li>
                        )}
                        {groupedUsers.Admin.map((user) => (
                            <li key={user.id} className="mb-1 flex items-center justify-between">
                                <span>
                                    <span className="font-medium">{user.full_name}</span>
                                    <span className="text-gray-500 text-xs ml-2">
                                        {user.email}
                                    </span>
                                </span>
                                {/* Remove delete button for Admins */}
                            </li>
                        ))}
                    </ul>
                    {/* Add Admin */}
                    {addUserRole === "Admin" ? (
                        <div className="mt-2 flex flex-col gap-2">
                            <input
                                className="border rounded px-2 py-1 text-sm"
                                placeholder="Search user by name or email..."
                                value={searchTerm}
                                onChange={e => {
                                    setSearchTerm(e.target.value);
                                    setSelectedUserId(null);
                                }}
                                autoFocus
                                autoComplete="off"
                                name="search-user-admin" 
                            />
                            <div className="max-h-32 overflow-y-auto border rounded">
                                {filteredUsers("Admin").length === 0 && (
                                    <div className="p-2 text-gray-400 text-xs">No users found.</div>
                                )}
                                {filteredUsers("Admin").map(u => (
                                    <div
                                        key={u.id}
                                        className={`p-2 cursor-pointer hover:bg-blue-50 ${selectedUserId === u.id ? "bg-blue-100" : ""}`}
                                        onClick={() => setSelectedUserId(u.id)}
                                    >
                                        {u.full_name} <span className="text-xs text-gray-500">({u.email})</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    className="bg-green-600 text-white px-3 py-1 rounded"
                                    onClick={handleAddUser}
                                    disabled={selectedUserId == null}
                                >
                                    Add
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-gray-200 px-3 py-1 rounded"
                                    onClick={() => {
                                        setAddUserRole(null);
                                        setSelectedUserId(null);
                                        setSearchTerm("");
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            size="sm"
                            className="bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 mt-2"
                            onClick={() => {
                                setAddUserRole("Admin");
                                setSearchTerm("");
                                setSelectedUserId(null);
                            }}
                        >
                            <FaPlus className="inline mr-1" /> Add Admin
                        </Button>
                    )}
                </div>
                {/* Editors */}
                <div className="bg-white rounded-xl shadow p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <FaUserEdit className="text-green-600" />
                        <span className="font-semibold text-lg">Editors</span>
                    </div>
                    <ul>
                        {groupedUsers.Editor.length === 0 && (
                            <li className="text-gray-400 text-sm">No editors found.</li>
                        )}
                        {groupedUsers.Editor.map((user) => (
                            <li key={user.id} className="mb-1 flex items-center justify-between">
                                <span>
                                    <span className="font-medium">{user.full_name}</span>
                                    <span className="text-gray-500 text-xs ml-2">
                                        {user.email}
                                    </span>
                                </span>
                                <Button
                                    size="sm"
                                    className="bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 ml-2"
                                    onClick={() => handleDeleteUser(user.id)}
                                    title="Remove editor"
                                >
                                    <FaTrash />
                                </Button>
                            </li>
                        ))}
                    </ul>
                    {/* Add Editor */}
                    {addUserRole === "Editor" ? (
                        <div className="mt-2 flex flex-col gap-2">
                            <input
                                className="border rounded px-2 py-1 text-sm"
                                placeholder="Search user by name or email..."
                                value={searchTerm}
                                onChange={e => {
                                    setSearchTerm(e.target.value);
                                    setSelectedUserId(null);
                                }}
                                autoFocus
                                autoComplete="off"
                                name="search-user-editor"
                            />
                            <div className="max-h-32 overflow-y-auto border rounded">
                                {filteredUsers("Editor").length === 0 && (
                                    <div className="p-2 text-gray-400 text-xs">No users found.</div>
                                )}
                                {filteredUsers("Editor").map(u => (
                                    <div
                                        key={u.id}
                                        className={`p-2 cursor-pointer hover:bg-blue-50 ${selectedUserId === u.id ? "bg-blue-100" : ""}`}
                                        onClick={() => setSelectedUserId(u.id)}
                                    >
                                        {u.full_name} <span className="text-xs text-gray-500">({u.email})</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    className="bg-green-600 text-white px-3 py-1 rounded"
                                    onClick={handleAddUser}
                                    disabled={selectedUserId == null}
                                >
                                    Add
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-gray-200 px-3 py-1 rounded"
                                    onClick={() => {
                                        setAddUserRole(null);
                                        setSelectedUserId(null);
                                        setSearchTerm("");
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            size="sm"
                            className="bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 mt-2"
                            onClick={() => {
                                setAddUserRole("Editor");
                                setSearchTerm("");
                                setSelectedUserId(null);
                            }}
                        >
                            <FaPlus className="inline mr-1" /> Add Editor
                        </Button>
                    )}
                </div>
                {/* Viewers */}
                <div className="bg-white rounded-xl shadow p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <FaUser className="text-gray-600" />
                        <span className="font-semibold text-lg">Viewers</span>
                    </div>
                    <ul>
                        {groupedUsers.Viewer.length === 0 && (
                            <li className="text-gray-400 text-sm">No viewers found.</li>
                        )}
                        {groupedUsers.Viewer.map((user) => (
                            <li key={user.id} className="mb-1 flex items-center justify-between">
                                <span>
                                    <span className="font-medium">{user.full_name}</span>
                                    <span className="text-gray-500 text-xs ml-2">
                                        {user.email}
                                    </span>
                                </span>
                                <Button
                                    size="sm"
                                    className="bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 ml-2"
                                    onClick={() => handleDeleteUser(user.id)}
                                    title="Remove viewer"
                                >
                                    <FaTrash />
                                </Button>
                            </li>
                        ))}
                    </ul>
                    {/* Add Viewer */}
                    {addUserRole === "Viewer" ? (
                        <div className="mt-2 flex flex-col gap-2">
                            <input
                                className="border rounded px-2 py-1 text-sm"
                                placeholder="Search user by name or email..."
                                value={searchTerm}
                                onChange={e => {
                                    setSearchTerm(e.target.value);
                                    setSelectedUserId(null);
                                }}
                                autoFocus
                                autoComplete="off"
                                name="search-user-viewer"
                            />
                            <div className="max-h-32 overflow-y-auto border rounded">
                                {filteredUsers("Viewer").length === 0 && (
                                    <div className="p-2 text-gray-400 text-xs">No users found.</div>
                                )}
                                {filteredUsers("Viewer").map(u => (
                                    <div
                                        key={u.id}
                                        className={`p-2 cursor-pointer hover:bg-blue-50 ${selectedUserId === u.id ? "bg-blue-100" : ""}`}
                                        onClick={() => setSelectedUserId(u.id)}
                                    >
                                        {u.full_name} <span className="text-xs text-gray-500">({u.email})</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    className="bg-green-600 text-white px-3 py-1 rounded"
                                    onClick={handleAddUser}
                                    disabled={selectedUserId == null}
                                >
                                    Add
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-gray-200 px-3 py-1 rounded"
                                    onClick={() => {
                                        setAddUserRole(null);
                                        setSelectedUserId(null);
                                        setSearchTerm("");
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            size="sm"
                            className="bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 mt-2"
                            onClick={() => {
                                setAddUserRole("Viewer");
                                setSearchTerm("");
                                setSelectedUserId(null);
                            }}
                        >
                            <FaPlus className="inline mr-1" /> Add Viewer
                        </Button>
                    )}
                </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left border-b">
                                <th className="py-2 px-2">Role</th>
                                <th className="py-2 px-2">Edit</th>
                                <th className="py-2 px-2">Delete</th>
                                <th className="py-2 px-2">Update</th>
                                <th className="py-2 px-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role) => (
                                <tr key={role.id} className="border-b hover:bg-gray-50">
                                    <td className="py-2 px-2 font-semibold">{role.name}</td>
                                    <td className="py-2 px-2">
                                        {editRoleId === role.id ? (
                                            role.name === "Admin" ? (
                                                <span>✅</span>
                                            ) : (
                                                <input
                                                    type="checkbox"
                                                    checked={editPermissions.edit}
                                                    onChange={(e) =>
                                                        handlePermissionChange(
                                                            "edit",
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                            )
                                        ) : (
                                            <span>{role.permissions.edit ? "✅" : "❌"}</span>
                                        )}
                                    </td>
                                    <td className="py-2 px-2">
                                        {editRoleId === role.id ? (
                                            role.name === "Admin" ? (
                                                <span>✅</span>
                                            ) : (
                                                <input
                                                    type="checkbox"
                                                    checked={editPermissions.delete}
                                                    onChange={(e) =>
                                                        handlePermissionChange(
                                                            "delete",
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                            )
                                        ) : (
                                            <span>{role.permissions.delete ? "✅" : "❌"}</span>
                                        )}
                                    </td>
                                    <td className="py-2 px-2">
                                        {editRoleId === role.id ? (
                                            role.name === "Admin" ? (
                                                <span>✅</span>
                                            ) : (
                                                <input
                                                    type="checkbox"
                                                    checked={editPermissions.update}
                                                    onChange={(e) =>
                                                        handlePermissionChange(
                                                            "update",
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                            )
                                        ) : (
                                            <span>{role.permissions.update ? "✅" : "❌"}</span>
                                        )}
                                    </td>
                                    <td className="py-2 px-2 flex gap-2">
                                        {role.name === "Admin" ? (
                                            <span className="text-gray-400 text-xs">Locked</span>
                                        ) : editRoleId === role.id ? (
                                            <>
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 text-white px-3 py-1 rounded"
                                                    onClick={handleSave}
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-gray-200 px-3 py-1 rounded"
                                                    onClick={() => setEditRoleId(null)}
                                                >
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                size="sm"
                                                className="bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200"
                                                onClick={() => handleEdit(role)}
                                            >
                                                <FaEdit className="inline mr-1" />
                                                Edit
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {roles.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-6 text-center text-gray-400">
                                        No roles found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="mt-6 text-gray-500 text-sm">
                <strong>Note:</strong> These permissions affect what actions each role can
                performance on the admin account and throughout the dashboard.
            </div>
        </div>
    );
};

export default PermissionPage;