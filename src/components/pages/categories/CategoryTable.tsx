import { Input } from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Button } from "../../widgets/button";

interface Category {
  id: number;
  name: string;
  description: string;
}

interface CategoryTableProps {
  categories: Category[];
  editId: number | null;
  editValue: string;
  editDescription: string;
  setEditValue: (v: string) => void;
  setEditDescription: (v: string) => void;
  handleEdit: (id: number, name: string, description: string) => void;
  handleEditSave: (id: number) => void;
  handleDelete: (id: number) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  editId,
  editValue,
  editDescription,
  setEditValue,
  setEditDescription,
  handleEdit,
  handleEditSave,
  handleDelete,
}) => (
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
);

export default CategoryTable;