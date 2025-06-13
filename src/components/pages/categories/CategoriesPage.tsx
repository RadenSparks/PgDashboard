import { useState } from "react";
import {
  Input,
  FormControl,
  FormLabel,
  Stack,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Button } from "../../widgets/button";
import { useAddCategoryMutation, useDeleteCategoryMutation, useGetCategoriesQuery, useUpdateCategoryMutation } from "../../../redux/api/categoryApi";
import Loading from "../../widgets/loading";

const CategoriesPage = () => {
  // const [categories, setCategories] = useState<Category[]>(initialCategories);
  const { data: categories, isLoading } = useGetCategoriesQuery()
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
    await updateCategory({ id, name: editValue.trim(), description: editDescription.trim() }).unwrap()
    setEditId(null);
    setEditValue("");
    setEditDescription("");
    toast({
      title: "Update created.",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom",
    });
  };

  const handleDelete = async (id: number) => {
    await deleteCategory(id)
  };
  if (isLoading) return <Loading></Loading>;
  return (
    <Box minH="100vh" bg="gray.50" py={10} px={2}>
      <Box
        bg="white"
        rounded="2xl"
        shadow="xl"
        maxW="900px"
        mx="auto"
        p={{ base: 4, md: 8 }}
      >
        <Stack direction={{ base: "column", md: "row" }} justify="space-between" align="center" mb={8}>
          <Box>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Categories</h2>
            <p className="text-gray-500">Manage your product categories below.</p>
          </Box>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-lg font-bold shadow-md"
            onClick={onOpen}
            type="button"
          >
            <FaPlus style={{ marginRight: 8 }} />
            Add Category
          </Button>
        </Stack>
        <Box overflowX="auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b bg-gray-100">
                <th className="py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Description</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4 align-top">
                    {editId === cat.id ? (
                      <Input
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        size="sm"
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === "Enter") handleEditSave(cat.id);
                        }}
                        variant="filled"
                        bg="gray.100"
                      />
                    ) : (
                      <span className="font-medium text-gray-800">{cat.name}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 align-top">
                    {editId === cat.id ? (
                      <Input
                        value={editDescription}
                        onChange={e => setEditDescription(e.target.value)}
                        size="sm"
                        placeholder="Description"
                        onKeyDown={e => {
                          if (e.key === "Enter") handleEditSave(cat.id);
                        }}
                        variant="filled"
                        bg="gray.100"
                      />
                    ) : (
                      <span className="text-gray-600">{cat.description}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <Button
                      size="sm"
                      className="bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200"
                      onClick={() => handleEdit(cat.id, cat.name, cat.description)}
                      type="button"
                    >
                      <FaEdit style={{ marginRight: 6 }} />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-100 text-red-700 border border-red-300 hover:bg-red-200"
                      onClick={() => handleDelete(cat.id)}
                      type="button"
                    >
                      <FaTrash style={{ marginRight: 6 }} />
                      Delete
                    </Button>
                    {editId === cat.id && (
                      <Button
                        size="sm"
                        className="bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200"
                        onClick={() => handleEditSave(cat.id)}
                        type="button"
                      >
                        Save
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-400">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Box>
      </Box>

      {/* Create Category Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontWeight="bold">Create New Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Category Name</FormLabel>
              <Input
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                placeholder="Enter category name"
                autoFocus
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="Enter category description"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700 mr-3 px-6 py-2 rounded-lg font-bold shadow-md"
              onClick={handleAdd}
            >
              Create
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CategoriesPage;