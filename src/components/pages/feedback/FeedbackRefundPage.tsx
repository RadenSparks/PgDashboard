import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Select,
  Textarea,
  Badge,
  Spinner,
  useToast,
  Divider,
  Avatar,
  Tooltip,
  Flex,
  Tag,
  TagLabel,
  TagLeftIcon,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FaSearch,
  FaCheck,
  FaTimes,
  FaUndoAlt,
  FaEnvelopeOpenText,
  FaSort,
  FaUser,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaCreditCard,
  FaFileImage,
  FaFileVideo,
  FaInfoCircle,
} from "react-icons/fa";
import {
  useGetRefundRequestsQuery,
  useUpdateRefundRequestStatusMutation,
  useProcessRefundMutation,
  type RefundRequest as ApiRefundRequest,
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

type UploadFile = {
  type: string; // 'image' | 'video'
  url: string;
};

type RefundRequestUser = {
  username?: string;
  email?: string;
  avatar_url?: string | null;
};

type RefundRequestOrder = {
  id?: number;
};

type RefundRequest = {
  id: number;
  user?: RefundRequestUser;
  order?: RefundRequestOrder;
  amount?: number;
  status: string;
  created_at?: string;
  reason?: string;
  uploadFiles?: UploadFile[];
  paymentMethod?: string;
};

const columns = [
  { key: "user", label: "Người dùng" },
  { key: "userEmail", label: "Email" },
  { key: "orderId", label: "Mã đơn hàng" },
  { key: "amount", label: "Số tiền" },
  { key: "status", label: "Trạng thái" },
  { key: "created_at", label: "Ngày gửi" },
  { key: "actions", label: "Thao tác" },
];

const FeedbackRefundPage: React.FC = () => {
  const { data: refundRequestsRaw = [], isLoading } = useGetRefundRequestsQuery();
  const refundRequests: RefundRequest[] = refundRequestsRaw.map((r: ApiRefundRequest) => ({
    ...r,
    user: r.user
      ? {
          ...r.user,
          avatar_url: r.user.avatar_url ?? undefined,
        }
      : undefined,
  }));

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<RefundRequest | null>(null);
  const [updateStatus, { isLoading: updating }] = useUpdateRefundRequestStatusMutation();
  const [processRefund, { isLoading: refunding }] = useProcessRefundMutation();
  const [sortBy, setSortBy] = useState<"user" | "userEmail" | "orderId" | "amount" | "status" | "created_at" | "">( "");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [previewMedia, setPreviewMedia] = useState<{ type: string; url: string } | null>(null);
  const { isOpen: isPreviewOpen, onOpen: openPreview, onClose: closePreview } = useDisclosure();
  const toast = useToast();

  // Sorting logic
  const sorted = [...refundRequests].sort((a, b) => {
    if (!sortBy) return 0;
    let valA: string | number = "", valB: string | number = "";
    switch (sortBy) {
      case "user":
        valA = a.user?.username || a.user?.email || "";
        valB = b.user?.username || b.user?.email || "";
        break;
      case "userEmail":
        valA = a.user?.email || "";
        valB = b.user?.email || "";
        break;
      case "orderId":
        valA = a.order?.id ?? 0;
        valB = b.order?.id ?? 0;
        break;
      case "amount":
        valA = a.amount ?? 0;
        valB = b.amount ?? 0;
        break;
      case "status":
        valA = a.status;
        valB = b.status;
        break;
      case "created_at":
        valA = a.created_at || "";
        valB = b.created_at || "";
        break;
      default:
        valA = "";
        valB = "";
    }
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Filter and search
  const filtered = sorted.filter(f =>
    (filter === "All" || f.status === filter) &&
    (
      (f.user?.username?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (f.user?.email?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (f.order?.id?.toString().includes(search) ?? false)
    )
  );

  // Helper: get all refund requests for the same order
  const getRelatedRequests = (orderId: number) =>
    refundRequests.filter(r => r.order?.id === orderId);

  // Update status for all refund requests of the same order
  const handleStatus = async (id: number, status: string) => {
    try {
      const target = refundRequests.find(r => r.id === id);
      if (!target || !target.order?.id) return;

      // Find all requests for this order
      const related = getRelatedRequests(target.order.id);

      // Update all requests in parallel
      await Promise.all(
        related.map(r =>
          updateStatus({ id: r.id, status }).unwrap()
        )
      );

      toast({
        title: "Cập nhật trạng thái thành công cho tất cả yêu cầu cùng đơn hàng.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setSelected(null);
    } catch (err) {
      toast({
        title: "Lỗi cập nhật trạng thái.",
        description: err instanceof Error ? err.message : "Đã xảy ra lỗi.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Process refund for all requests of the same order
  const handleProcessRefund = async (id: number) => {
    try {
      const target = refundRequests.find(r => r.id === id);
      if (!target || !target.order?.id) return;

      // Find all requests for this order
      const related = getRelatedRequests(target.order.id);

      // Process refund for all requests in parallel
      await Promise.all(
        related.map(r =>
          processRefund({ id: r.id }).unwrap()
        )
      );

      toast({
        title: "Đã đánh dấu hoàn tiền cho tất cả yêu cầu cùng đơn hàng.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setSelected(null);
    } catch (err) {
      toast({
        title: "Lỗi xử lý hoàn tiền.",
        description: err instanceof Error ? err.message : "Đã xảy ra lỗi.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSort = (key: "user" | "userEmail" | "orderId" | "amount" | "status" | "created_at") => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }
  };

  return (
    <Box className="p-6 sm:p-10 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 flex items-center gap-3">
        <FaEnvelopeOpenText className="text-blue-500" /> Quản lý yêu cầu hoàn tiền
      </h2>
      {/* Search & Filter */}
      <Box className="flex flex-col md:flex-row gap-4 mb-6 bg-white rounded-xl shadow px-6 py-4 items-center">
        <Flex align="center" gap={2} flex={1}>
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
        </Flex>
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
              {columns.map(col => (
                <th
                  key={col.key}
                  className="py-3 px-4 text-left cursor-pointer select-none"
                  onClick={() =>
                    col.key !== "actions" &&
                    handleSort(col.key as "user" | "userEmail" | "orderId" | "amount" | "status" | "created_at")
                  }
                >
                  {col.label}
                  {col.key !== "actions" && (
                    <FaSort className="inline ml-2 text-xs" />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-gray-400">
                  <Spinner />
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-gray-400">
                  Không tìm thấy yêu cầu hoàn tiền nào.
                </td>
              </tr>
            ) : (
              filtered.map(f => (
                <tr key={f.id} className="border-b last:border-b-0 hover:bg-blue-50 transition">
                  <td className="py-3 px-4 font-medium">
                    <Flex align="center" gap={2}>
                      <Avatar
                        size="sm"
                        name={f.user?.username || f.user?.email}
                        src={f.user?.avatar_url ?? undefined}
                        bg="blue.100"
                        color="blue.700"
                        icon={<FaUser />}
                      />
                      <span>{f.user?.username || f.user?.email}</span>
                    </Flex>
                  </td>
                  <td className="py-3 px-4">{f.user?.email}</td>
                  <td className="py-3 px-4">{f.order?.id || <span className="text-gray-400">—</span>}</td>
                  <td className="py-3 px-4">
                    <Tag colorScheme="green" size="md">
                      <TagLeftIcon as={FaMoneyBillWave} />
                      <TagLabel>
                        {f.amount?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                      </TagLabel>
                    </Tag>
                  </td>
                  <td className="py-3 px-4">
                    <Badge colorScheme={statusColors[f.status] || "gray"}>
                      {statusLabels[f.status] || f.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Flex align="center" gap={1}>
                      <FaCalendarAlt className="mr-1 text-blue-400" />
                      {f.created_at?.slice(0, 10)}
                    </Flex>
                  </td>
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
            className="bg-white rounded-2xl shadow-xl p-10 max-w-5xl w-full relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-6 right-6 text-gray-400 hover:text-red-500 text-2xl"
              onClick={() => !updating && setSelected(null)}
              aria-label="Đóng"
            >
              <FaTimes />
            </button>
            <h3 className="text-2xl font-bold mb-2 text-blue-800 flex items-center gap-2">
              <FaUndoAlt className="text-red-400" />
              Chi tiết yêu cầu hoàn tiền
            </h3>
            <Divider mb={4} />
            <Flex direction={{ base: "column", md: "row" }} gap={10} mb={2}>
              <Box flex={1} minW={0}>
                <Flex align="center" gap={3} mb={2}>
                  <Avatar
                    size="lg"
                    name={selected.user?.username || selected.user?.email}
                    src={selected.user?.avatar_url ?? undefined}
                    bg="blue.100"
                    color="blue.700"
                    icon={<FaUser />}
                  />
                  <Box>
                    <div className="font-semibold text-blue-700 text-lg">{selected.user?.username || selected.user?.email}</div>
                    <div className="text-gray-500 text-md">{selected.user?.email}</div>
                  </Box>
                </Flex>
                <Flex align="center" gap={2} mb={2}>
                  <FaCreditCard className="text-blue-400" />
                  <span className="font-semibold">Phương thức thanh toán:</span>
                  <span className="ml-1">{selected.paymentMethod || "—"}</span>
                </Flex>
                <Flex align="center" gap={2} mb={2}>
                  <FaMoneyBillWave className="text-green-400" />
                  <span className="font-semibold">Số tiền:</span>
                  <span className="ml-1">{selected.amount?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
                </Flex>
                <Flex align="center" gap={2} mb={2}>
                  <FaInfoCircle className="text-blue-400" />
                  <span className="font-semibold">Mã đơn hàng:</span>
                  <span className="ml-1">{selected.order?.id || "—"}</span>
                </Flex>
                <Flex align="center" gap={2} mb={2}>
                  <FaCalendarAlt className="text-blue-400" />
                  <span className="font-semibold">Ngày gửi:</span>
                  <span className="ml-1">{selected.created_at?.slice(0, 10)}</span>
                </Flex>
                <Flex align="center" gap={2} mb={2}>
                  <Badge colorScheme={statusColors[selected.status] || "gray"} fontSize="lg" px={4} py={2}>
                    {statusLabels[selected.status] || selected.status}
                  </Badge>
                </Flex>
              </Box>
              <Box flex={1} minW={0}>
                <div className="font-semibold mb-2 text-blue-700 text-lg">Lý do hoàn tiền:</div>
                <Textarea
                  value={selected.reason ?? ""}
                  isReadOnly
                  rows={5}
                  fontSize="md"
                  className="mb-4 bg-blue-50 border-blue-200"
                />
                {selected.uploadFiles && selected.uploadFiles.length > 0 && (
                  <div>
                    <div className="font-semibold mb-2 text-blue-700 text-lg">Minh chứng khách hàng gửi:</div>
                    <Flex wrap="wrap" gap={4} maxH="260px" overflowY="auto">
                      {/* Video: show first video only, large */}
                      {selected.uploadFiles
                        .filter(f => f.type === 'video')
                        .slice(0, 1)
                        .map((file, idx) => (
                          <Tooltip label="Video minh chứng" key={idx}>
                            <Box
                              cursor="pointer"
                              onClick={() => {
                                setPreviewMedia(file);
                                openPreview();
                              }}
                              className="flex flex-col items-center"
                            >
                              <FaFileVideo className="text-purple-400 mb-1 text-2xl" />
                              <video
                                src={file.url}
                                controls
                                className="w-72 h-48 rounded border bg-black object-contain"
                                style={{ maxWidth: 320, maxHeight: 192 }}
                              />
                              <span className="text-xs text-gray-500 mt-1">Nhấn để xem lớn</span>
                            </Box>
                          </Tooltip>
                        ))}
                      {/* Images: show up to 5, larger */}
                      {selected.uploadFiles
                        .filter(f => f.type === 'image')
                        .slice(0, 5)
                        .map((file, idx) => (
                          <Tooltip label="Ảnh minh chứng" key={idx}>
                            <Box
                              cursor="pointer"
                              onClick={() => {
                                setPreviewMedia(file);
                                openPreview();
                              }}
                              className="flex flex-col items-center"
                            >
                              <FaFileImage className="text-blue-400 mb-1 text-2xl" />
                              <img
                                src={file.url}
                                alt={`evidence-${idx}`}
                                className="w-40 h-32 object-cover rounded border"
                                style={{ maxWidth: 160, maxHeight: 128 }}
                              />
                              <span className="text-xs text-gray-500 mt-1">Nhấn để xem lớn</span>
                            </Box>
                          </Tooltip>
                        ))}
                    </Flex>
                  </div>
                )}
              </Box>
            </Flex>
            <Divider my={6} />
            <Flex gap={4} justify="flex-end" flexWrap="wrap">
              {selected.status === "PENDING" && (
                <>
                  <Button
                    colorScheme="green"
                    leftIcon={<FaCheck />}
                    onClick={() => handleStatus(selected.id, "APPROVED")}
                    isLoading={updating}
                    size="lg"
                  >
                    Duyệt
                  </Button>
                  <Button
                    colorScheme="red"
                    leftIcon={<FaTimes />}
                    onClick={() => handleStatus(selected.id, "REJECTED")}
                    isLoading={updating}
                    size="lg"
                  >
                    Từ chối
                  </Button>
                  <Button
                    colorScheme="purple"
                    leftIcon={<FaUndoAlt />}
                    onClick={() => handleProcessRefund(selected.id)}
                    isLoading={refunding}
                    size="lg"
                  >
                    Đánh dấu đã hoàn tiền
                  </Button>
                </>
              )}
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={() => setSelected(null)}
                size="lg"
              >
                Đóng
              </Button>
              {(updating || refunding) && <Spinner color="blue.500" size="lg" />}
            </Flex>
          </Box>
          {/* Preview Modal for media */}
          {previewMedia && isPreviewOpen && (
            <Box
              className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
              onClick={closePreview}
            >
              <Box
                className="bg-white rounded-2xl shadow-2xl p-6 max-w-3xl w-full relative flex flex-col items-center"
                onClick={e => e.stopPropagation()}
              >
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
                  onClick={closePreview}
                  aria-label="Đóng"
                >
                  <FaTimes />
                </button>
                {previewMedia.type === "image" ? (
                  <img
                    src={previewMedia.url}
                    alt="preview"
                    className="max-w-full max-h-[70vh] rounded border"
                  />
                ) : (
                  <video
                    src={previewMedia.url}
                    controls
                    autoPlay
                    className="max-w-full max-h-[70vh] rounded border bg-black"
                  />
                )}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default FeedbackRefundPage;