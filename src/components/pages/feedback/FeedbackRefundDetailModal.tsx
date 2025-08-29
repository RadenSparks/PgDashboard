import React from "react";
import {
  Box, Button, Divider, Avatar, Tooltip, Flex, Textarea, Badge, Grid, GridItem, Heading, Text, Stack, Spinner
} from "@chakra-ui/react";
import {
  FaCheck, FaTimes, FaUndoAlt, FaUser, FaMoneyBillWave, FaCalendarAlt, FaCreditCard, FaFileImage, FaFileVideo, FaInfoCircle, FaListOl, FaBan
} from "react-icons/fa";
import type { RefundRequest } from "./types";

// Use the same status labels/colors as table
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

interface Props {
  selected: RefundRequest;
  updating: boolean;
  refunding: boolean;
  handleStatus: (id: number, status: string) => void;
  handleProcessRefund: (id: number) => void;
  setSelected: (r: RefundRequest | null) => void;
  previewMedia: { type: string; url: string } | null;
  setPreviewMedia: (media: { type: string; url: string } | null) => void;
  openPreview: () => void;
  isPreviewOpen: boolean;
  closePreview: () => void;
}

const FeedbackRefundDetailModal: React.FC<Props> = ({
  selected,
  updating,
  refunding,
  handleStatus,
  handleProcessRefund,
  setSelected,
  previewMedia,
  setPreviewMedia,
  openPreview,
  isPreviewOpen,
  closePreview,
}) => (
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
      <Heading size="md" mb={4} color="blue.800" display="flex" alignItems="center" gap={2}>
        <FaUndoAlt className="text-red-400" />
        Chi tiết yêu cầu hoàn tiền
      </Heading>
      <Divider mb={4} />
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8}>
        <GridItem>
          <Stack spacing={3}>
            <Flex align="center" gap={3}>
              <Avatar
                size="lg"
                name={selected.user?.username || selected.user?.email}
                src={selected.user?.avatar_url ?? undefined}
                bg="blue.100"
                color="blue.700"
                icon={<FaUser />}
              />
              <Box>
                <Text fontWeight="bold" color="blue.700" fontSize="lg">{selected.user?.username || selected.user?.email}</Text>
                <Text color="gray.500">{selected.user?.email}</Text>
                {selected.user?.phone_number && <Text color="gray.500">{selected.user?.phone_number}</Text>}
                {selected.user?.address && <Text color="gray.500">{selected.user?.address}</Text>}
              </Box>
            </Flex>
            <Flex align="center" gap={2}>
              <FaInfoCircle className="text-blue-400" />
              <Text fontWeight="semibold">Mã đơn hàng:</Text>
              <Text ml={1}>{selected.order?.id || "—"}</Text>
            </Flex>
            <Flex align="center" gap={2}>
              <FaCreditCard className="text-blue-400" />
              <Text fontWeight="semibold">Phương thức thanh toán:</Text>
              <Text ml={1}>{selected.paymentMethod || selected.order?.payment_type || "—"}</Text>
            </Flex>
            <Flex align="center" gap={2}>
              <FaMoneyBillWave className="text-green-400" />
              <Text fontWeight="semibold">Số tiền:</Text>
              <Text ml={1}>{selected.amount?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</Text>
            </Flex>
            <Flex align="center" gap={2}>
              <FaCalendarAlt className="text-blue-400" />
              <Text fontWeight="semibold">Ngày gửi:</Text>
              <Text ml={1}>{selected.created_at?.slice(0, 10)}</Text>
            </Flex>
            {/* Correct status label and color */}
            <Flex align="center" gap={2}>
              <Badge colorScheme={statusColors[selected.status] || "gray"} fontSize="lg" px={4} py={2}>
                {statusLabels[selected.status] || selected.status}
              </Badge>
            </Flex>
            <Flex align="center" gap={2}>
              <FaBan className="text-blue-400" />
              <Text fontWeight="semibold">Ngân hàng:</Text>
              <Text ml={1}>{selected.bank || "—"}</Text>
            </Flex>
            <Flex align="center" gap={2}>
              <FaCreditCard className="text-blue-400" />
              <Text fontWeight="semibold">Số tài khoản:</Text>
              <Text ml={1}>{selected.toAccountNumber || "—"}</Text>
            </Flex>
            <Flex align="center" gap={2}>
              <FaListOl className="text-blue-400" />
              <Text fontWeight="semibold">Mã BIN:</Text>
              <Text ml={1}>{selected.toBin || "—"}</Text>
            </Flex>
            <Flex align="center" gap={2}>
              <FaListOl className="text-blue-400" />
              <Text fontWeight="semibold">Số lần yêu cầu:</Text>
              <Text ml={1}>{selected.times || "—"}</Text>
            </Flex>
            <Flex align="center" gap={2}>
              <Text fontWeight="semibold">Địa chỉ giao hàng:</Text>
              <Text ml={1}>{selected.order?.shipping_address || "—"}</Text>
            </Flex>
            <Flex align="center" gap={2}>
              <Text fontWeight="semibold">Trạng thái sản phẩm:</Text>
              <Text ml={1}>{selected.order?.productStatus || "—"}</Text>
            </Flex>
            <Flex align="center" gap={2}>
              <Text fontWeight="semibold">Trạng thái thanh toán:</Text>
              <Text ml={1}>{selected.order?.payment_status || "—"}</Text>
            </Flex>
          </Stack>
        </GridItem>
        <GridItem>
          <Stack spacing={3}>
            <Text fontWeight="bold" color="blue.700" fontSize="lg">Lý do hoàn tiền:</Text>
            <Textarea
              value={selected.reason ?? ""}
              isReadOnly
              rows={5}
              fontSize="md"
              className="mb-2 bg-blue-50 border-blue-200"
            />
            {selected.uploadFiles && selected.uploadFiles.length > 0 && (
              <Box>
                <Text fontWeight="bold" color="blue.700" fontSize="lg" mb={2}>Minh chứng khách hàng gửi:</Text>
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
              </Box>
            )}
          </Stack>
        </GridItem>
      </Grid>
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
);

export default FeedbackRefundDetailModal;