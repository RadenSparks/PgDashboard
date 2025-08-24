import React, { useState } from "react";
import { Box, Button, Input, Select, Textarea, Badge, Spinner } from "@chakra-ui/react";
import { FaSearch, FaCheck, FaTimes, FaUndoAlt, FaEnvelopeOpenText } from "react-icons/fa";
import {
  useGetRefundRequestsQuery,
  useUpdateRefundRequestStatusMutation,
  useProcessRefundMutation,
} from "../../../redux/api/ordersApi";

const statusColors: Record<string, string> = {
  PENDING: "yellow",
  APPROVED: "green",
  REJECTED: "red",
  REFUNDED: "purple",
};

const statusLabels: Record<string, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  REFUNDED: "Đã hoàn tiền",
};

const FeedbackRefundPage: React.FC = () => {
  const { data: refundRequests = [], isLoading } = useGetRefundRequestsQuery();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  type RefundRequest = {
    id: number;
    user?: {
      username?: string;
      email?: string;
    };
    order?: {
      id?: number;
    };
    amount?: number;
    status: string;
    created_at?: string;
    reason?: string;
  };

  const [selected, setSelected] = useState<RefundRequest | null>(null);
  const [updateStatus, { isLoading: updating }] = useUpdateRefundRequestStatusMutation();
  const [processRefund, { isLoading: refunding }] = useProcessRefundMutation();

  const filtered = refundRequests.filter(f =>
    (filter === "All" || f.status === filter) &&
    (
      f.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
      f.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      (f.order?.id?.toString().includes(search))
    )
  );

  const handleStatus = async (id: number, status: string) => {
    await updateStatus({ id, status });
    setSelected(null);
  };

  const handleProcessRefund = async (id: number) => {
    await processRefund({ id });
    setSelected(null);
  };

  return (
    <Box className="p-6 sm:p-10 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 flex items-center gap-3">
        <FaEnvelopeOpenText className="text-blue-500" /> Yêu cầu hoàn tiền
      </h2>
      {/* Search & Filter */}
      <Box className="flex flex-col md:flex-row gap-4 mb-6 bg-white rounded-xl shadow px-6 py-4 items-center">
        <div className="flex items-center gap-2 flex-1">
          <Input
            placeholder="Tìm theo người dùng, email hoặc mã đơn hàng"
            value={search}
            onChange={e => setSearch(e.target.value)}
            size="md"
            bg="blue.50"
            borderColor="blue.200"
            _focus={{ borderColor: "blue.400", bg: "white" }}
          />
          <FaSearch className="text-blue-400" />
        </div>
        <Select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          size="md"
          maxW="200px"
          bg="blue.50"
          borderColor="blue.200"
          _focus={{ borderColor: "blue.400", bg: "white" }}
        >
          <option value="All">Tất cả trạng thái</option>
          <option value="PENDING">Chờ duyệt</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="REJECTED">Từ chối</option>
          <option value="REFUNDED">Đã hoàn tiền</option>
        </Select>
      </Box>
      {/* Table */}
      <Box className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-blue-50 text-blue-800">
              <th className="py-3 px-4 text-left">Người dùng</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Mã đơn hàng</th>
              <th className="py-3 px-4 text-left">Số tiền</th>
              <th className="py-3 px-4 text-left">Trạng thái</th>
              <th className="py-3 px-4 text-left">Ngày gửi</th>
              <th className="py-3 px-4 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400">
                  <Spinner />
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400">
                  Không tìm thấy yêu cầu hoàn tiền nào.
                </td>
              </tr>
            ) : (
              filtered.map(f => (
                <tr key={f.id} className="border-b last:border-b-0 hover:bg-blue-50 transition">
                  <td className="py-3 px-4 font-medium">{f.user?.username || f.user?.email}</td>
                  <td className="py-3 px-4">{f.user?.email}</td>
                  <td className="py-3 px-4">{f.order?.id || <span className="text-gray-400">—</span>}</td>
                  <td className="py-3 px-4">{f.amount}</td>
                  <td className="py-3 px-4">
                    <Badge colorScheme={statusColors[f.status] || "gray"}>
                      {statusLabels[f.status] || f.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">{f.created_at?.slice(0, 10)}</td>
                  <td className="py-3 px-4">
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => setSelected(f)}
                    >
                      Xem
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Box>
      {/* Detail Modal */}
      {selected && (
        <Box
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fade-in"
          onClick={() => !updating && setSelected(null)}
        >
          <Box
            className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl"
              onClick={() => !updating && setSelected(null)}
              aria-label="Đóng"
            >
              <FaTimes />
            </button>
            <h3 className="text-xl font-bold mb-2 text-blue-800 flex items-center gap-2">
              <FaUndoAlt className="text-red-400" />
              Chi tiết yêu cầu hoàn tiền
            </h3>
            <div className="mb-2 text-gray-600 text-sm">
              <span className="font-semibold">Người dùng:</span> {selected.user?.username || selected.user?.email} <br />
              <span className="font-semibold">Email:</span> {selected.user?.email} <br />
              <span className="font-semibold">Mã đơn hàng:</span> {selected.order?.id} <br />
              <span className="font-semibold">Số tiền:</span> {selected.amount} <br />
              <span className="font-semibold">Ngày gửi:</span> {selected.created_at?.slice(0, 10)}
            </div>
            <Textarea
              value={selected.reason}
              isReadOnly
              rows={5}
              className="mb-4 bg-blue-50 border-blue-200"
            />
            <div className="flex gap-3 mt-4">
              {selected.status === "PENDING" && (
                <>
                  <Button
                    colorScheme="green"
                    leftIcon={<FaCheck />}
                    onClick={() => handleStatus(selected.id, "APPROVED")}
                    isLoading={updating}
                  >
                    Duyệt
                  </Button>
                  <Button
                    colorScheme="red"
                    leftIcon={<FaTimes />}
                    onClick={() => handleStatus(selected.id, "REJECTED")}
                    isLoading={updating}
                  >
                    Từ chối
                  </Button>
                  <Button
                    colorScheme="purple"
                    leftIcon={<FaUndoAlt />}
                    onClick={() => handleProcessRefund(selected.id)}
                    isLoading={refunding}
                  >
                    Đánh dấu đã hoàn tiền
                  </Button>
                </>
              )}
              {selected.status !== "PENDING" && (
                <Button
                  colorScheme="blue"
                  variant="outline"
                  onClick={() => setSelected(null)}
                >
                  Đóng
                </Button>
              )}
              {(updating || refunding) && <Spinner color="blue.500" size="md" />}
            </div>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FeedbackRefundPage;