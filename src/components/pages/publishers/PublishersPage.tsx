import React, { useState } from "react";
import {
  Button, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, useDisclosure, useToast, Table, Thead, Tbody, Tr, Th, Td, IconButton, Box, Text
} from "@chakra-ui/react";
import { Edit, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import {
  useGetPublishersQuery,
  useAddPublisherMutation,
  useUpdatePublisherMutation,
  useDeletePublisherMutation,
} from "../../../redux/api/publishersApi";
import Loading from "../../widgets/loading"; // <-- Add this import


const PAGE_SIZE = 10;

const PublishersPage: React.FC = () => {
  const { data: publishers = [], refetch, isLoading } = useGetPublishersQuery(); // <-- get isLoading
  const [addPublisher] = useAddPublisherMutation();
  const [updatePublisher] = useUpdatePublisherMutation();
  const [deletePublisher] = useDeletePublisherMutation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formName, setFormName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(publishers.length / PAGE_SIZE);
  const paginatedPublishers = publishers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleOpenModal = (publisher?: { id: number; name: string }) => {
    if (publisher) {
      setFormName(publisher.name);
      setEditingId(publisher.id);
    } else {
      setFormName("");
      setEditingId(null);
    }
    onOpen();
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      toast({ title: "Tên publisher không được để trống", status: "error" });
      return;
    }
    try {
      if (editingId) {
        await updatePublisher({ id: editingId, name: formName }).unwrap();
        toast({ title: "Cập nhật thành công", status: "success" });
      } else {
        await addPublisher({ name: formName }).unwrap();
        toast({ title: "Thêm thành công", status: "success" });
      }
      refetch();
      onClose();
    } catch {
      toast({ title: "Có lỗi xảy ra", status: "error" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePublisher(id).unwrap();
      toast({ title: "Xóa thành công", status: "success" });
      refetch();
    } catch {
      toast({ title: "Có lỗi xảy ra", status: "error" });
    }
  };

  // --- LOADING TRANSITION ---
  if (isLoading) return <Loading />;

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      <Box maxW="5xl" mx="auto">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={8}>
          <Text fontSize="3xl" fontWeight="bold">Quản lý Nhà xuất bản</Text>
          <Button leftIcon={<Plus size={20} />} colorScheme="blue" onClick={() => handleOpenModal()}>
            Thêm Publisher
          </Button>
        </Box>
        <Table variant="simple" bg="white" rounded="xl" shadow="md">
          <Thead>
            <Tr>
              <Th>Tên Publisher</Th>
              <Th>Số sản phẩm</Th>
              <Th>Sản phẩm</Th>
              <Th>Hành động</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedPublishers.map((pub) => (
              <Tr key={pub.id}>
                <Td fontWeight="semibold">{pub.name}</Td>
                <Td>{pub.products?.length || 0}</Td>
                <Td>
                  <Box display="flex" flexWrap="wrap" gap={2}>
                    {pub.products?.slice(0, 3).map((p) => (
                      <Text key={p.id} fontSize="sm" bg="blue.50" px={2} py={1} rounded="md">
                        {p.product_name}
                        <span className="ml-2 text-gray-500">{p.category_ID?.name}</span>
                        {p.tags?.length > 0 && (
                          <span className="ml-2 text-blue-600">
                            {(p.tags as { type: string; name: string }[]).filter(t => t.type === "genre").map(t => t.name).join(", ")}
                          </span>
                        )}
                      </Text>
                    ))}
                    {pub.products?.length > 3 && (
                      <Text fontSize="sm" color="gray.500">+{pub.products.length - 3} khác</Text>
                    )}
                  </Box>
                </Td>
                <Td>
                  <IconButton
                    aria-label="Edit"
                    icon={<Edit size={16} />}
                    size="sm"
                    colorScheme="blue"
                    variant="ghost"
                    onClick={() => handleOpenModal(pub)}
                    mr={2}
                  />
                  <IconButton
                    aria-label="Delete"
                    icon={<Trash2 size={16} />}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => handleDelete(pub.id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" alignItems="center" mt={6} gap={2}>
            <Button
              leftIcon={<ChevronLeft size={16} />}
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              isDisabled={currentPage === 1}
              variant="outline"
            >
              Prev
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                size="sm"
                onClick={() => setCurrentPage(i + 1)}
                colorScheme={currentPage === i + 1 ? "blue" : "gray"}
                variant={currentPage === i + 1 ? "solid" : "outline"}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              rightIcon={<ChevronRight size={16} />}
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              isDisabled={currentPage === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </Box>
        )}
      </Box>
      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingId ? "Chỉnh sửa Publisher" : "Thêm Publisher mới"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Tên publisher"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Hủy</Button>
            <Button colorScheme="blue" onClick={handleSave}>
              {editingId ? "Cập nhật" : "Thêm mới"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PublishersPage;