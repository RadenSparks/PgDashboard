import { useState } from "react";
import {
  Stack,
  Box,
  Divider,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaPlus, FaTags } from "react-icons/fa";
import { Button } from "../../widgets/button";
import { useAddCategoryMutation, useDeleteCategoryMutation, useGetCategoriesQuery, useUpdateCategoryMutation } from "../../../redux/api/categoryApi";
import Loading from "../../widgets/loading";
import CategoryTable from "./CategoryTable";
import CategoryModal from "./CategoryModal";

const CategoriesPage = () => {
  const { data: categories, isLoading } = useGetCategoriesQuery();
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

  const handleAdd = async () => {
    if (newCategory.trim()) {
      await addCategory({ name: newCategory.trim(), description: newDescription.trim() }).unwrap();
      toast({
        title: "Category created.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setNewCategory("");
      setNewDescription("");
      onClose();
    } else {
      toast({
        title: "Category name required.",
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
    await updateCategory({ id, name: editValue.trim(), description: editDescription.trim() }).unwrap();
    setEditId(null);
    setEditValue("");
    setEditDescription("");
    toast({
      title: "Category updated.",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom",
    });
  };

  const handleDelete = async (id: number) => {
    await deleteCategory(id);
    toast({
      title: "Category deleted.",
      status: "info",
      duration: 2000,
      isClosable: true,
      position: "bottom",
    });
  };

  if (isLoading) return <Loading />;

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
              <h2 className="text-3xl font-bold text-blue-800">Category Management</h2>
            </div>
            <p className="text-gray-500 ml-1">Manage your product categories below.</p>
          </Box>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-lg font-bold shadow-md flex items-center gap-2 transition"
            onClick={onOpen}
            type="button"
          >
            <FaPlus />
            Add Category
          </Button>
        </Stack>
        <Divider mb={6} />
        <Box overflowX="auto" className="rounded-lg border border-gray-100 shadow-sm bg-gray-50">
          <CategoryTable
            categories={(categories ?? []).map(cat => ({
              ...cat,
              description: cat.description ?? ""
            }))}
            editId={editId}
            editValue={editValue}
            editDescription={editDescription}
            setEditValue={setEditValue}
            setEditDescription={setEditDescription}
            handleEdit={handleEdit}
            handleEditSave={handleEditSave}
            handleDelete={handleDelete}
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