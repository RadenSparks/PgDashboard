import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../widgets/button";
import { FaPlus, FaArrowLeft, FaUserPlus, FaFilter } from "react-icons/fa";
import type { User } from "../users/usersData";
import {
  useGetUsersQuery,
  useAddUserMutation,
  useDeleteUserMutation,
  useSetUserStatusMutation,
} from "../../../redux/api/usersApi";
import UsersTable from "./UsersTable";
import AddUserModal from "./AddUserModal";
import RecentlyJoinedUsers from "./RecentlyJoinedUsers";
import UndoDeleteModal from "./UndoDeleteModal";
import { useToast } from "@chakra-ui/react";

const UNDO_TIMEOUT = 8000;
const RECENT_USER_COUNT = 5;
const emptyUser: User = {
  id: 0,
  full_name: "",
  username: "",
  password: "",
  phone_number: "",
  address: "",
  avatar_url: "",
  email: "",
  role: "user",
  status: true,
};

const UsersPage = () => {
  const { data: users = [], refetch } = useGetUsersQuery();
  const [addUser] = useAddUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [setUserStatus] = useSetUserStatusMutation();
  const toast = useToast();

  const [pendingDelete, setPendingDelete] = useState<{ user: User; timeLeft: number } | null>(null);
  const [fadingUserId, setFadingUserId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState<User>({ ...emptyUser });
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const filterNew = params.get("filter") === "new";

  // Calculate recent users
  const sortedUsers = [...users].sort((a, b) => b.id - a.id);
  const recentUsers = sortedUsers.slice(0, RECENT_USER_COUNT);
  const filteredUsers = filterNew ? recentUsers : users;
  const visibleUsers = filteredUsers.filter(user => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return user.status === true;
    if (statusFilter === "suspended") return user.status === false;
    return true;
  });

  // Delete timer/fade logic
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

    timeout = setTimeout(async () => {
      await deleteUser(pendingDelete.user.id);
      setPendingDelete(null);
      setFadingUserId(null);
      refetch();
      toast({
        title: "User deleted",
        description: `User "${pendingDelete.user.full_name}" has been deleted.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, pendingDelete.timeLeft);

    return () => {
      if (fadeTimeout) clearTimeout(fadeTimeout);
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [pendingDelete?.user.id, pendingDelete]);

  // Add user modal logic
  const handleAddUser = () => {
    setShowAddModal(true);
    setNewUser({ ...emptyUser, id: Date.now() });
  };

  const handleSaveNewUser = async () => {
    try {
      const result = await addUser({
        ...newUser,
        role: "user",
        status: newUser.status ?? true,
      }).unwrap();
      setShowAddModal(false);
      setNewUser({ ...emptyUser });
      refetch();
      toast({
        title: "User added",
        description: "The user was added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Failed to add user",
        description: "Please check your input or try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleChangeNewUser = (field: keyof User, value: string | boolean) => {
    setNewUser(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleStatus = async (id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    await setUserStatus({ id, status: !user.status });
    refetch();
  };

  const handleDelete = (id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    setPendingDelete({ user, timeLeft: UNDO_TIMEOUT });
  };

  const handleUndoDelete = () => {
    setPendingDelete(null);
    setFadingUserId(null);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {filterNew ? "Newly Joined Users" : "Users"}
        </h2>
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-2"
          onClick={handleAddUser}
        >
          <FaPlus />
          Add User
        </Button>
      </div>

      {!filterNew && (
        <RecentlyJoinedUsers
          recentUsers={recentUsers}
          onShowOnlyNew={() => navigate("?filter=new")}
        />
      )}

      {filterNew && (
        <div className="mb-6 flex justify-end">
          <Button
            className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 border border-gray-300 rounded text-sm hover:bg-gray-200 transition"
            onClick={() => navigate("/users")}
          >
            <FaArrowLeft />
            Back to All Users
          </Button>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded ${statusFilter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setStatusFilter("all")}
        >
          All
        </button>
        <button
          className={`px-3 py-1 rounded ${statusFilter === "active" ? "bg-green-500 text-white" : "bg-gray-200"}`}
          onClick={() => setStatusFilter("active")}
        >
          Active
        </button>
        <button
          className={`px-3 py-1 rounded ${statusFilter === "suspended" ? "bg-red-500 text-white" : "bg-gray-200"}`}
          onClick={() => setStatusFilter("suspended")}
        >
          Suspended
        </button>
      </div>

      <UsersTable
        users={visibleUsers}
        fadingUserId={fadingUserId}
        pendingDelete={pendingDelete}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
      />

      <AddUserModal
        show={showAddModal}
        newUser={newUser}
        onChange={handleChangeNewUser}
        onSave={handleSaveNewUser}
        onClose={() => setShowAddModal(false)}
      />

      <UndoDeleteModal
        pendingDelete={pendingDelete}
        UNDO_TIMEOUT={UNDO_TIMEOUT}
        onUndo={handleUndoDelete}
        onToast={({ title, description, status }) =>
          toast({
            title,
            description,
            status,
            duration: 3000,
            isClosable: true,
          })
        }
      />

      <div className="mt-6 text-gray-500 text-sm">
        <strong>Note:</strong> User information is managed and updated from the main site. You cannot edit user info here. Any changes will be reflected automatically when updated on the main site.
      </div>
    </div>
  );
};

export default UsersPage;