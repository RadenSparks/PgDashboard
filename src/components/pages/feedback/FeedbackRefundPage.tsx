import React, { useState } from "react";
import {
  Box,
  Input,
  Select,
  Heading,
  Flex,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FaEnvelopeOpenText,
  FaSearch,
} from "react-icons/fa";
import {
  useGetRefundRequestsQuery,
  useUpdateRefundRequestStatusMutation,
  useProcessRefundMutation,
  type RefundRequest as ApiRefundRequest,
} from "../../../redux/api/ordersApi";
import FeedbackRefundTable from "./FeedbackRefundTable";
import FeedbackRefundDetailModal from "./FeedbackRefundDetailModal";
import type { RefundRequest } from "./types";

const FeedbackRefundPage: React.FC = () => {
  const { data: refundRequestsRaw = [], isLoading } = useGetRefundRequestsQuery();
  const refundRequests: RefundRequest[] = refundRequestsRaw.map((r: ApiRefundRequest) => ({
    ...r,
    user: r.user
      ? {
          username: r.user.username,
          email: r.user.email,
          avatar_url: r.user.avatar_url ?? undefined,
          phone_number: r.user.phone_number ?? "",
          address: r.user.address ?? "",
        }
      : undefined,
    order: r.order
      ? {
          id: r.order.id,
          order_code: r.order.order_code ?? "",
          total_price: r.order.total_price ?? 0,
          payment_type: r.order.payment_type ?? "",
          shipping_address: r.order.shipping_address ?? "",
          productStatus: r.order.productStatus ?? "",
          payment_status: r.order.payment_status ?? "",
        }
      : undefined,
    uploadFiles: Array.isArray(r.uploadFiles)
      ? r.uploadFiles.map((f: unknown) => {
          if (
            typeof f === "object" &&
            f !== null &&
            "type" in f &&
            "url" in f
          ) {
            const fileObj = f as { type?: unknown; url?: unknown };
            return {
              type: typeof fileObj.type === "string" ? fileObj.type : "",
              url: typeof fileObj.url === "string" ? fileObj.url : "",
            };
          }
          return { type: "", url: "" };
        })
      : [],
    paymentMethod: typeof r.paymentMethod === "string" ? r.paymentMethod : "",
    toAccountNumber: typeof r.toAccountNumber === "string" ? r.toAccountNumber : "",
    toBin: typeof r.toBin === "string" ? r.toBin : "",
    bank: typeof r.bank === "string" ? r.bank : "",
    times: typeof r.times === "number" ? r.times : undefined,
  }));

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<RefundRequest | null>(null);
  const [updateStatus, { isLoading: updating }] = useUpdateRefundRequestStatusMutation();
  const [processRefund, { isLoading: refunding }] = useProcessRefundMutation();
  const [sortBy, setSortBy] = useState<string>("");
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

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }
  };

  return (
    <Box className="p-6 sm:p-10 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Heading size="lg" mb={6} color="blue.800" display="flex" alignItems="center" gap={3}>
        <FaEnvelopeOpenText className="text-blue-500" /> Quản lý yêu cầu hoàn tiền
      </Heading>
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
      <FeedbackRefundTable
        isLoading={isLoading}
        filtered={filtered}
        handleSort={handleSort}
        setSelected={setSelected}
        sortBy={sortBy}
      />
      {/* Detail Modal */}
      {selected && (
        <FeedbackRefundDetailModal
          selected={selected}
          updating={updating}
          refunding={refunding}
          handleStatus={handleStatus}
          handleProcessRefund={handleProcessRefund}
          setSelected={setSelected}
          previewMedia={previewMedia}
          setPreviewMedia={setPreviewMedia}
          openPreview={openPreview}
          isPreviewOpen={isPreviewOpen}
          closePreview={closePreview}
        />
      )}
    </Box>
  );
};

export default FeedbackRefundPage;