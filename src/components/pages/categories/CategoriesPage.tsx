import { useState } from "react";
import { Input, FormControl, FormLabel, Stack } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Button } from "../../widgets/button";

const initialCategories = [
  { id: 1, name: "Board Games" },
  { id: 2, name: "Card Games" },
  { id: 3, name: "Accessories" },
];

const CategoriesPage = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAdd = () => {
    if (newCategory.trim()) {
      setCategories([
        ...categories,
        { id: Date.now(), name: newCategory.trim() },
      ]);
      setNewCategory("");
    }
  };

  const handleEdit = (id: number, name: string) => {
    setEditId(id);
    setEditValue(name);
  };

  const handleEditSave = (id: number) => {
    setCategories(categories.map(cat => cat.id === id ? { ...cat, name: editValue } : cat));
    setEditId(null);
    setEditValue("");
  };

  const handleDelete = (id: number) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Categories</h2>
      <div className="bg-white rounded-xl shadow p-6 max-w-xl">
        <Stack direction="row" spacing={4} mb={6}>
          <FormControl>
            <FormLabel fontSize="sm">Add New Category</FormLabel>
            <Input
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              placeholder="Category name"
              size="md"
            />
          </FormControl>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700 px-6 mt-6"
            onClick={handleAdd}
            type="button"
          >
            <FaPlus style={{ marginRight: 8 }} />
            Add
          </Button>
        </Stack>
        <div>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 px-2">Name</th>
                <th className="py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2">
                    {editId === cat.id ? (
                      <Input
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        size="sm"
                        autoFocus
                        onBlur={() => handleEditSave(cat.id)}
                        onKeyDown={e => {
                          if (e.key === "Enter") handleEditSave(cat.id);
                        }}
                      />
                    ) : (
                      cat.name
                    )}
                  </td>
                  <td className="py-2 px-2 flex gap-2">
                    <Button
                      size="sm"
                      className="bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200"
                      onClick={() => handleEdit(cat.id, cat.name)}
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
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-6 text-center text-gray-400">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;