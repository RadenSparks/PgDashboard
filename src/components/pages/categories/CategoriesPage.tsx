import { useState } from "react";
import {
  Stack,
  Box,
  Divider,
  useDisclosure,
  useToast,
  Switch,
  FormLabel,
  Flex,
} from "@chakra-ui/react";
import { FaPlus, FaTags } from "react-icons/fa";
import { Button } from "../../widgets/button";
import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useGetDeletedCategoriesQuery,
  useUpdateCategoryMutation,
  useRestoreCategoryMutation,
} from "../../../redux/api/categoryApi";
import Loading from "../../widgets/loading";
import CategoryTable from "./CategoryTable";
import CategoryModal from "./CategoryModal";

const CategoriesPage = () => {
  const [showDeleted, setShowDeleted] = useState(false);

  const { data: categories, isLoading } = useGetCategoriesQuery();
  const { data: deletedCategories, isLoading: loadingDeleted } = useGetDeletedCategoriesQuery();
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [addCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [restoreCategory] = useRestoreCategoryMutation();

  const handleAdd = async () => {
    if (newCategory.trim()) {
      try {
        await addCategory({ name: newCategory.trim(), description: newDescription.trim() }).unwrap();
        toast({
          title: "Đã tạo danh mục.",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "bottom",
        });
        setNewCategory("");
        setNewDescription("");
        onClose();
      } catch {
        toast({
          title: "Có lỗi khi tạo danh mục.",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom",
        });
      }
    } else {
      toast({
        title: "Tên danh mục là bắt buộc.",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleEdit = (id: number, name: string, description: string) => {
    setEditId(id);
    setEditValue(name);
    setEditDescription(description);
  };

  const handleEditSave = async (id: number) => {
    try {
      await updateCategory({ id, name: editValue.trim(), description: editDescription.trim() }).unwrap();
      setEditId(null);
      setEditValue("");
      setEditDescription("");
      toast({
        title: "Đã cập nhật danh mục.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    } catch {
      toast({
        title: "Có lỗi khi cập nhật danh mục.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id).unwrap();
      toast({
        title: "Đã xóa (ẩn) danh mục.",
        status: "info",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    } catch {
      toast({
        title: "Có lỗi khi xóa danh mục.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreCategory(id).unwrap();
      toast({
        title: "Đã khôi phục danh mục.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    } catch {
      toast({
        title: "Có lỗi khi khôi phục danh mục.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  if (isLoading || loadingDeleted) return <Loading />;

  // Only show deleted categories when toggled
  const rawCategories = showDeleted
    ? (deletedCategories ?? []).filter(cat => !!cat.deletedAt)
    : (categories ?? []).filter(cat => !cat.deletedAt);

  // Ensure description is always a string
  const tableCategories = rawCategories.map(cat => ({
    ...cat,
    description: cat.description ?? "",
  }));

  return (
    <Box minH="100vh" bgGradient="linear(to-br, blue.50, white)" py={10} px={2}>
      <Box
        bg="white"
        rounded="2xl"
        shadow="xl"
        maxW="900px"
        mx="auto"
        p={{ base: 4, md: 8 }}
        border="1px solid"
        borderColor="blue.100"
      >
        <Stack direction={{ base: "column", md: "row" }} justify="space-between" align="center" mb={6}>
          <Box>
            <div className="flex items-center gap-3 mb-1">
              <FaTags className="text-blue-600 text-2xl" />
              <h2 className="text-3xl font-bold text-blue-800">Quản lý danh mục</h2>
            </div>
            <p className="text-gray-500 ml-1">Quản lý các danh mục sản phẩm bên dưới.</p>
          </Box>
          <Flex align="center" gap={4}>
            <FormLabel htmlFor="showDeleted" mb="0" fontWeight="bold" color="gray.700">
              Hiển thị đã xóa
            </FormLabel>
            <Switch
              id="showDeleted"
              isChecked={showDeleted}
              onChange={() => setShowDeleted(v => !v)}
              colorScheme="red"
            />
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-lg font-bold shadow-md flex items-center gap-2 transition"
              onClick={onOpen}
              type="button"
            >
              <FaPlus />
              Thêm danh mục
            </Button>
          </Flex>
        </Stack>
        <Divider mb={6} />
        <Box overflowX="auto" className="rounded-lg border border-gray-100 shadow-sm bg-gray-50">
          <CategoryTable
            categories={tableCategories}
            editId={editId}
            editValue={editValue}
            editDescription={editDescription}
            setEditValue={setEditValue}
            setEditDescription={setEditDescription}
            handleEdit={handleEdit}
            handleEditSave={handleEditSave}
            handleDelete={handleDelete}
            handleRestore={handleRestore}
          />
        </Box>
      </Box>

      {/* Create Category Modal */}
      <CategoryModal
        isOpen={isOpen}
        onClose={onClose}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        newDescription={newDescription}
        setNewDescription={setNewDescription}
        handleAdd={handleAdd}
      />
    </Box>
  );
};

export default CategoriesPage;