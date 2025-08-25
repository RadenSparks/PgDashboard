import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../widgets/button";
import { FaPlus, FaArrowLeft } from "react-icons/fa";
import type { User } from "../../../redux/api/usersApi";
import {
  useGetUsersQuery,
  useAddUserMutation,
  useDeleteUserMutation,
  useSetUserStatusMutation,
} from "../../../redux/api/usersApi";
import { useToast } from "@chakra-ui/react";
import RecentlyJoinedUsers from "./RecentlyJoinedUsers";
import UsersTable from "./UsersTable";
import AddUserModal from "./AddUserModal";
import UndoDeleteModal from "./UndoDeleteModal";

const UNDO_TIMEOUT = 8000;
const RECENT_USER_COUNT = 5;
const PAGE_SIZE = 10;
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

const UsersPage: React.FC = () => {
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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

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
  }).filter(user =>
    searchTerm === "" ||
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(visibleUsers.length / PAGE_SIZE);
  const paginatedUsers = visibleUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

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
        title: "Đã xóa người dùng",
        description: `Người dùng "${pendingDelete.user.full_name}" đã bị xóa.`,
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
  }, [pendingDelete, deleteUser, refetch, toast]);

  // Add user modal logic
  const handleAddUser = () => {
    setShowAddModal(true);
    setNewUser({ ...emptyUser, id: Date.now() });
  };

  const handleSaveNewUser = async () => {
    try {
      await addUser({
        ...newUser,
        role: "user",
        status: newUser.status ?? true,
      }).unwrap();
      setShowAddModal(false);
      setNewUser({ ...emptyUser });
      refetch();
      toast({
        title: "Đã thêm người dùng",
        description: "Người dùng đã được thêm thành công.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Thêm người dùng thất bại",
        description: "Vui lòng kiểm tra thông tin đầu vào hoặc thử lại.",
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
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight">
          {filterNew ? "Người dùng mới đăng ký" : "Quản lý người dùng"}
        </h2>
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-2 rounded-lg flex items-center gap-2 shadow"
          onClick={handleAddUser}
        >
          <FaPlus />
          Thêm người dùng
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Tìm theo tên, tên đăng nhập hoặc email"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              statusFilter === "all"
                ? "bg-blue-500 text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-blue-100"
            }`}
            onClick={() => setStatusFilter("all")}
          >
            Tất cả
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              statusFilter === "active"
                ? "bg-green-500 text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-green-100"
            }`}
            onClick={() => setStatusFilter("active")}
          >
            Hoạt động
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              statusFilter === "suspended"
                ? "bg-red-500 text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-red-100"
            }`}
            onClick={() => setStatusFilter("suspended")}
          >
            Tạm khóa
          </button>
        </div>
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
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-base hover:bg-gray-200 transition"
            onClick={() => navigate("/users")}
          >
            <FaArrowLeft />
            Quay lại tất cả người dùng
          </Button>
        </div>
      )}

      <UsersTable
        users={paginatedUsers}
        fadingUserId={fadingUserId}
        pendingDelete={pendingDelete}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold disabled:opacity-50 transition"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Trước
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white shadow"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-200"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold disabled:opacity-50 transition"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Sau
          </button>
        </div>
      )}

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
        onToast={({
          title,
          description,
          status,
        }: { title: string; description?: string; status: "success" | "error" | "info" | "warning" }) =>
          toast({
            title,
            description,
            status,
            duration: 3000,
            isClosable: true,
          })
        }
      />

      <div className="mt-8 text-gray-500 text-sm bg-white rounded-xl shadow p-6">
        <strong>Lưu ý:</strong> Thông tin người dùng được quản lý và cập nhật từ trang chính. Bạn không thể chỉnh sửa thông tin người dùng tại đây. Mọi thay đổi sẽ được cập nhật tự động khi chỉnh sửa trên trang chính.
      </div>
    </div>
  );
};

export default UsersPage;