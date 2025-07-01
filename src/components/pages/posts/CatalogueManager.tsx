import React, { useEffect, useState } from 'react';
import api from '../../../api/axios-client';
import { useToast } from '@chakra-ui/react';

interface Catalogue {
  id: number;
  name: string;
  canonical?: string;
}

const CatalogueManager: React.FC = () => {
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editCanonical, setEditCanonical] = useState('');
  const toast = useToast();

  const fetchCatalogues = async () => {
    const res = await api.get('/post-catalogues');
    setCatalogues(res.data);
  };

  useEffect(() => { fetchCatalogues(); }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const canonical = newName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    await api.post('/post-catalogues', { name: newName, canonical });
    setNewName('');
    fetchCatalogues();
  };

  const handleEdit = (cat: Catalogue) => {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditCanonical(cat.canonical || '');
  };

  const handleUpdate = async () => {
    if (!editName.trim() || !editCanonical.trim() || editId === null) return;
    await api.patch(`/post-catalogues/${editId}`, { name: editName, canonical: editCanonical });
    setEditId(null);
    setEditName('');
    setEditCanonical('');
    fetchCatalogues();
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/post-catalogues/${id}`);
      fetchCatalogues();
    } catch (error: any) {
      toast({
        title: 'Cannot delete catalogue',
        description:
          error?.response?.data?.message ||
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
        <span className="text-xs text-gray-400 font-normal">Manage your post categories</span>
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
      <ul className="max-h-[500px] min-h-[300px] overflow-y-auto divide-y bg-gray-50 rounded-lg shadow-inner">
        {catalogues.length === 0 && (
          <li className="py-6 text-center text-gray-400">No catalogues yet.</li>
        )}
        {catalogues.map(cat => (
          <li
            key={cat.id}
            className="flex flex-wrap items-center gap-3 py-3 px-3 group hover:bg-blue-50 transition"
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
                    className="text-green-600 font-semibold px-3 py-1 hover:underline text-base"
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
                    className="text-gray-500 px-3 py-1 hover:underline text-base"
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
                  className="text-blue-600 hover:underline px-3 py-1 opacity-0 group-hover:opacity-100 transition text-base"
                  title="Edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-red-600 hover:underline px-3 py-1 opacity-0 group-hover:opacity-100 transition text-base"
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