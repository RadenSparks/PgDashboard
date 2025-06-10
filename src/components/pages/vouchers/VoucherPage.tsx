import { useState, useRef, useEffect } from "react";
import { Button } from "../../widgets/button";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

type Voucher = {
  id: number;
  code: string;
  discount: string;
  expiry: string;
  status: "Active" | "Inactive" | "Expired";
};

const mockVouchers: Voucher[] = [
  {
    id: 1,
    code: "SUMMER25",
    discount: "25%",
    expiry: "2025-08-31",
    status: "Active",
  },
  {
    id: 2,
    code: "WELCOME10",
    discount: "10%",
    expiry: "2025-12-31",
    status: "Expired",
  },
];

const emptyVoucher: Voucher = {
  id: 0,
  code: "",
  discount: "",
  expiry: "",
  status: "Inactive",
};

const VoucherPage = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>(mockVouchers);
  const [showModal, setShowModal] = useState(false);
  const [editVoucher, setEditVoucher] = useState<Voucher | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Modal outside click close
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!showModal) return;
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowModal(false);
        setEditVoucher(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showModal]);

  const handleAdd = () => {
    setEditVoucher({ ...emptyVoucher, id: Date.now() });
    setShowModal(true);
  };

  const handleEdit = (id: number) => {
    const voucher = vouchers.find(v => v.id === id);
    if (voucher) {
      setEditVoucher({ ...voucher });
      setShowModal(true);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      setVouchers(vouchers.filter(v => v.id !== deleteId));
      setDeleteId(null);
    }
  };

  const cancelDelete = () => setDeleteId(null);

  const handleSave = () => {
    if (!editVoucher) return;
    if (editVoucher.id && vouchers.some(v => v.id === editVoucher.id)) {
      // Update
      setVouchers(vouchers.map(v => (v.id === editVoucher.id ? editVoucher : v)));
    } else {
      // Add
      setVouchers([{ ...editVoucher, id: Date.now() }, ...vouchers]);
    }
    setShowModal(false);
    setEditVoucher(null);
  };

  const handleChange = (field: keyof Voucher, value: string) => {
    if (!editVoucher) return;
    setEditVoucher({ ...editVoucher, [field]: value });
  };

  const handleStatusToggle = (id: number) => {
    setVouchers(vouchers =>
      vouchers.map(v =>
        v.id === id
          ? {
              ...v,
              status: v.status === "Active" ? "Inactive" : "Active",
            }
          : v
      )
    );
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Vouchers</h2>
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-2"
          onClick={handleAdd}
        >
          <FaPlus />
          Add Voucher
        </Button>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 px-2">Code</th>
                <th className="py-2 px-2">Discount</th>
                <th className="py-2 px-2">Expiry</th>
                <th className="py-2 px-2">Status</th>
                <th className="py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map(voucher => (
                <tr key={voucher.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2">{voucher.code}</td>
                  <td className="py-2 px-2">{voucher.discount}</td>
                  <td className="py-2 px-2">{voucher.expiry}</td>
                  <td className="py-2 px-2">
                    <span
                      className={
                        voucher.status === "Active"
                          ? "text-green-600 font-semibold"
                          : voucher.status === "Inactive"
                          ? "text-yellow-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {voucher.status}
                    </span>
                  </td>
                  <td className="py-2 px-2 flex gap-2">
                    <Button
                      size="sm"
                      className="bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200"
                      onClick={() => handleEdit(voucher.id)}
                    >
                      <FaEdit className="inline mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-100 text-red-700 border border-red-300 hover:bg-red-200"
                      onClick={() => handleDelete(voucher.id)}
                    >
                      <FaTrash className="inline mr-1" />
                      Delete
                    </Button>
                    <Button
                      size="sm"
                      className={
                        voucher.status === "Active"
                          ? "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                          : "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200"
                      }
                      onClick={() => handleStatusToggle(voucher.id)}
                    >
                      {voucher.status === "Active" ? "Set Inactive" : "Set Active"}
                    </Button>
                  </td>
                </tr>
              ))}
              {vouchers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-400">
                    No vouchers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && editVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative"
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => {
                setShowModal(false);
                setEditVoucher(null);
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">
              {vouchers.some(v => v.id === editVoucher.id) ? "Edit Voucher" : "Add Voucher"}
            </h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Code</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={editVoucher.code}
                  onChange={e => handleChange("code", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Discount</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={editVoucher.discount}
                  onChange={e => handleChange("discount", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expiry</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  type="date"
                  value={editVoucher.expiry}
                  onChange={e => handleChange("expiry", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={editVoucher.status}
                  onChange={e => handleChange("status", e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  type="submit"
                >
                  Save
                </Button>
                <Button
                  className="bg-gray-200 px-6 py-2 rounded"
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditVoucher(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-8 relative">
            <h3 className="text-lg font-bold mb-4 text-red-600">Delete Voucher</h3>
            <p className="mb-4">
              Are you sure you want to delete this voucher?
              <br />
              <span className="text-sm text-gray-500">This action cannot be undone.</span>
            </p>
            <div className="flex justify-end gap-2">
              <Button
                className="bg-gray-200 px-6 py-2 rounded"
                type="button"
                onClick={cancelDelete}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                type="button"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherPage;