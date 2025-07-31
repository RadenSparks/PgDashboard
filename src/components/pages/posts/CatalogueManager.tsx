import React, { useState } from 'react';
import {
  useGetCataloguesQuery,
  useAddCatalogueMutation,
  useUpdateCatalogueMutation,
  useDeleteCatalogueMutation,
} from '../../../redux/api/catalogueApi';
import { useToast } from '@chakra-ui/react';

const CatalogueManager: React.FC = () => {
  const { data: catalogues = [], refetch } = useGetCataloguesQuery();
  const [addCatalogue] = useAddCatalogueMutation();
  const [updateCatalogue] = useUpdateCatalogueMutation();
  const [deleteCatalogue] = useDeleteCatalogueMutation();
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editCanonical, setEditCanonical] = useState('');
  const toast = useToast();

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const canonical = newName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    await addCatalogue({ name: newName, canonical });
    setNewName('');
    refetch();
  };

  const handleEdit = (cat: { id: number; name: string; canonical?: string }) => {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditCanonical(cat.canonical || '');
  };

  const handleUpdate = async () => {
    if (!editName.trim() || !editCanonical.trim() || editId === null) return;
    await updateCatalogue({ id: editId, name: editName, canonical: editCanonical });
    setEditId(null);
    setEditName('');
    setEditCanonical('');
    refetch();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCatalogue(id);
      refetch();
    } catch (error: unknown) {
      toast({
        title: 'Cannot delete catalogue',
        description:
          (typeof error === 'object' && error !== null && 'data' in error && (error as { data?: { message?: string } }).data?.message) ||
          'This catalogue is still used by one or more posts.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="font-bold mb-4 text-lg text-blue-700 flex items-center gap-2 sticky top-0 bg-white z-10 py-2">
        <span className="inline-block bg-blue-100 text-blue-700 rounded-full px-2 py-1 text-sm">Catalogues</span>
      </h3>
      <div className="flex gap-2 mb-4">
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="New catalogue name"
          className="border rounded-lg p-3 flex-1 focus:ring-2 focus:ring-blue-300 transition text-base"
          onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow text-base"
        >
          Add
        </button>
      </div>
      <ul className="max-h-[500px] min-h-[300px] overflow-y-auto divide-y bg-gray-50 rounded-xl shadow-inner">
        {catalogues.length === 0 && (
          <li className="py-6 text-center text-gray-400">No catalogues yet.</li>
        )}
        {catalogues.map(cat => (
          <li
            key={cat.id}
            className="flex flex-wrap items-center gap-3 py-3 px-3 group hover:bg-blue-50 transition rounded-lg"
          >
            {editId === cat.id ? (
              <>
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="border rounded p-2 flex-1 min-w-0 focus:ring-2 focus:ring-blue-200 text-base"
                  placeholder="Name"
                  autoFocus
                />
                <input
                  value={editCanonical}
                  onChange={e => setEditCanonical(e.target.value)}
                  className="border rounded p-2 flex-1 min-w-0 focus:ring-2 focus:ring-blue-200 text-base"
                  placeholder="Canonical"
                />
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <button
                    onClick={handleUpdate}
                    className="bg-green-100 text-green-700 font-semibold px-4 py-1 rounded-lg hover:bg-green-200 transition"
                    title="Save"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditId(null);
                      setEditName('');
                      setEditCanonical('');
                    }}
                    className="bg-gray-100 text-gray-600 px-4 py-1 rounded-lg hover:bg-gray-200 transition"
                    title="Cancel"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="font-medium text-gray-800 text-base">{cat.name}</span>
                <span className="text-xs text-gray-400 bg-gray-200 rounded px-2 py-0.5">{cat.canonical}</span>
                <button
                  onClick={() => handleEdit(cat)}
                  className="bg-blue-100 text-blue-700 px-4 py-1 rounded-lg hover:bg-blue-200 transition font-semibold"
                  title="Edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="bg-red-100 text-red-600 px-4 py-1 rounded-lg hover:bg-red-200 transition font-semibold"
                  title="Delete"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-4 text-xs text-gray-400">
        <b>Tip:</b> Click <span className="text-blue-600">Edit</span> to rename or change the canonical. Catalogues in use cannot be deleted.
      </div>
    </div>
  );
};

export default CatalogueManager;