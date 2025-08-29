import React from "react";
import { Box, Flex, Avatar, Tag, TagLeftIcon, TagLabel, Badge, Button, Spinner } from "@chakra-ui/react";
import { FaUser, FaMoneyBillWave, FaCalendarAlt, FaSort } from "react-icons/fa";
import type { RefundRequest } from "./types";

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

const columns = [
  { key: "user", label: "Người dùng" },
  { key: "userEmail", label: "Email" },
  { key: "orderId", label: "Mã đơn hàng" },
  { key: "amount", label: "Số tiền" },
  { key: "status", label: "Trạng thái" },
  { key: "created_at", label: "Ngày gửi" },
  { key: "actions", label: "Thao tác" },
];

interface Props {
  isLoading: boolean;
  filtered: RefundRequest[];
  handleSort: (key: string) => void;
  setSelected: (r: RefundRequest) => void;
  sortBy: string;
}

const FeedbackRefundTable: React.FC<Props> = ({
  isLoading,
  filtered,
  handleSort,
  setSelected,
}) => (
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
                handleSort(col.key)
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
);

export default FeedbackRefundTable;