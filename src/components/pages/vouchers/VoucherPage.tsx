import { useState, useRef, useEffect } from "react";
import { Button } from "../../widgets/button";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import {
  useGetVouchersQuery,
  useAddVoucherMutation,
  useSetStatusVoucherMutation,
  useUpdateVoucherMutation,
  useDeleteVoucherMutation,
  type Voucher,
} from '../../../redux/api/vounchersApi'
import Loading from "../../../components/widgets/loading";
import { useToast } from "@chakra-ui/react";

const emptyVoucher: Omit<Voucher, "id"> = {
  code: "",
  startDate: "",
  endDate: "",
  maxOrderValue: 0,
  minOrderValue: 0,
  usageLimit: 1,
  discountPercent: 0,
  status: "active",
  milestonePoints: null,
  description: ''
};

const VoucherPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [editVoucher, setEditVoucher] = useState<Partial<Voucher> | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: vouchers = [], isLoading: isLoadingVoucher, refetch } = useGetVouchersQuery();
  const [addVoucher] = useAddVoucherMutation();
  const [updateVoucher] = useUpdateVoucherMutation();
  const [deleteVoucher] = useDeleteVoucherMutation();
  const [setStatusVoucher] = useSetStatusVoucherMutation();
  const toast = useToast();
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
    setEditVoucher({ ...emptyVoucher });
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

  const confirmDelete = async () => {
    if (deleteId !== null) {
      await deleteVoucher(deleteId);
      setDeleteId(null);
      refetch();
    }
  };

  const cancelDelete = () => setDeleteId(null);

  const handleSave = async () => {
    if (!editVoucher) return;
    // Ensure all required fields are present and not undefined
    const payload: Voucher = {
      id: editVoucher.id ?? 0, // 0 for new, will be ignored by backend
      code: editVoucher.code ?? "",
      description: editVoucher.description ?? "",
      usageLimit: Number(editVoucher.usageLimit ?? 0),
      discountPercent: Number(editVoucher.discountPercent ?? 0),
      minOrderValue: Number(editVoucher.minOrderValue ?? 0),
      maxOrderValue: Number(editVoucher.maxOrderValue ?? 0),
      startDate: editVoucher.startDate ? String(editVoucher.startDate) : "",
      endDate: editVoucher.endDate ? String(editVoucher.endDate) : "",
      status: (editVoucher.status as Voucher["status"]) || "Inactive",
      milestonePoints:
        editVoucher.milestonePoints === "" || editVoucher.milestonePoints === undefined
          ? null
          : Number(editVoucher.milestonePoints),
    };
    if (editVoucher.id) {
      await updateVoucher(payload);
    } else {
      // Remove id for creation
      const { id, ...createPayload } = payload;
      await addVoucher(createPayload as Omit<Voucher, "id">);
    }
    setShowModal(false);
    setEditVoucher(null);
    refetch();
  };
  const handleChange = (field: keyof Voucher, value: string | number | null) => {
    if (!editVoucher) return;

    if ((field === "startDate" && typeof value === "string") || (field === "endDate" && typeof value === "string")) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        toast({
          title: "Lỗi ngày bắt đầu",
          description: "Ngày bắt đầu và kết thúc không được trước ngày hôm nay.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        return;
      }
    }

    setEditVoucher({ ...editVoucher, [field]: value });
  };
  const toDatetimeLocal = (value: string | Date | null): string => {
    if (!value) return '';
    const date = new Date(value);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16); // yyyy-MM-ddTHH:mm
  };
  const handleStatusToggle = async (id: number) => {
    const voucher = vouchers.find(v => v.id === id);
    if (!voucher) return;
    const newStatus =
      voucher.status === "active"
        ? "inactive"
        : "active";
    await setStatusVoucher({ id, status: newStatus });
    refetch();
  };

  if (isLoadingVoucher) return <Loading />;

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
                <th className="py-2 px-2">Discount (%)</th>
                <th className="py-2 px-2">Min Order</th>
                <th className="py-2 px-2">Max Order</th>
                <th className="py-2 px-2">Usage Limit</th>
                <th className="py-2 px-2">Start</th>
                <th className="py-2 px-2">End</th>
                <th className="py-2 px-2">Status</th>
                <th className="py-2 px-2">Milestone Points</th>
                <th className="py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map(voucher => (
                <tr key={voucher.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2">{voucher.code}</td>
                  <td className="py-2 px-2">{voucher.discountPercent}</td>
                  <td className="py-2 px-2">{voucher.minOrderValue}</td>
                  <td className="py-2 px-2">{voucher.maxOrderValue}</td>
                  <td className="py-2 px-2">{voucher.usageLimit}</td>
                  <td className="py-2 px-2">{voucher.startDate}</td>
                  <td className="py-2 px-2">{voucher.endDate}</td>
                  <td className="py-2 px-2">
                    <span
                      className={
                        voucher.status === "active"
                          ? "text-green-600 font-semibold"
                          : voucher.status === "inactive"
                            ? "text-yellow-600 font-semibold"
                            : "text-red-600 font-semibold"
                      }
                    >
                      {voucher.status}
                    </span>
                  </td>
                  <td className="py-2 px-2">{voucher.milestonePoints ?? "-"}</td>
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
                  <td colSpan={10} className="py-6 text-center text-gray-400">
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
            className="bg-white rounded-xl shadow-lg w-[95%] sm:max-w-xl lg:max-w-3xl p-4 sm:p-6 mx-auto" 
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
              {editVoucher.id ? "Edit Voucher" : "Add Voucher"}
            </h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-6"
            >
              {/* Code */}
              <div>
                <label className="block text-sm font-medium mb-1">Code</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={editVoucher.code || ""}
                  onChange={e => handleChange("code", e.target.value)}
                  required
                />
              </div>

              {/* 2 cột Discount & Usage Limit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Discount (%)</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    type="number"
                    value={editVoucher.discountPercent ?? ""}
                    onChange={e => handleChange("discountPercent", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Usage Limit</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    type="number"
                    value={editVoucher.usageLimit ?? ""}
                    onChange={e => handleChange("usageLimit", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* 2 cột Min/Max Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Min Order Value</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    type="number"
                    value={editVoucher.minOrderValue ?? ""}
                    onChange={e => handleChange("minOrderValue", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Order Value</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    type="number"
                    value={editVoucher.maxOrderValue ?? ""}
                    onChange={e => handleChange("maxOrderValue", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    type="datetime-local"
                    value={toDatetimeLocal(editVoucher.startDate)}
                    onChange={e => handleChange("startDate", new Date(e.target.value).toISOString())}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    type="datetime-local"
                    value={toDatetimeLocal(editVoucher.endDate)}
                    onChange={e => handleChange("endDate", new Date(e.target.value).toISOString())}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Description Points (optional)</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  type="text"
                  value={editVoucher.description ?? ""}
                  onChange={e =>
                    handleChange("description", e.target.value === "" ? null : String(e.target.value))
                  }
                />
              </div>

              {/* Status & Milestone Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={editVoucher.status || "inactive"}
                    onChange={e => handleChange("status", e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Milestone Points (optional)</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    type="number"
                    min={0}
                    value={editVoucher.milestonePoints ?? ""}
                    onChange={e =>
                      handleChange(
                        "milestonePoints",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                    placeholder="Leave blank if not a milestone coupon"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
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