import { useState, useRef, useEffect } from "react";
import { Button } from "../../widgets/button";
import { FaPlus } from "react-icons/fa";
import { FaTicketAlt } from "react-icons/fa";
import {
  useGetVouchersQuery,
  useAddVoucherMutation,
  useSetStatusVoucherMutation,
  useUpdateVoucherMutation,
  useDeleteVoucherMutation,
  type Voucher as BaseVoucher,
} from '../../../redux/api/vounchersApi'

type Voucher = Omit<BaseVoucher, "id"> & { id?: number; collectionName: string };
import Loading from "../../../components/widgets/loading";
import { useToast } from "@chakra-ui/react";
import VoucherTable from "./VoucherTable";
import VoucherModal from "./VoucherModal";
import DeleteVoucherModal from "./DeleteVoucherModal";

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
  description: '',
  collectionName: ""
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
      id: editVoucher.id !== undefined ? editVoucher.id : 0, // 0 for new, will be ignored by backend
      code: editVoucher.code ?? "",
      description: editVoucher.description ?? "",
      usageLimit: Number(editVoucher.usageLimit ?? 0),
      discountPercent: Number(editVoucher.discountPercent ?? 0),
      minOrderValue: Number(editVoucher.minOrderValue ?? 0),
      maxOrderValue: Number(editVoucher.maxOrderValue ?? 0),
      startDate: editVoucher.startDate ? String(editVoucher.startDate) : "",
      endDate: editVoucher.endDate ? String(editVoucher.endDate) : "",
      status: (editVoucher.status as Voucher["status"]) || "inactive",
      milestonePoints:
        editVoucher.milestonePoints === null || editVoucher.milestonePoints === undefined
          ? null
          : Number(editVoucher.milestonePoints),
      collectionName: editVoucher.collectionName ?? "",
    };
    try {
      if (editVoucher.id !== undefined) {
        await updateVoucher(payload as Required<Voucher>);
        toast({
          title: "Đã cập nhật voucher",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Remove id for creation
        const createPayload = { ...payload };
        delete createPayload.id;
        await addVoucher(createPayload as Omit<Voucher, "id">);
        toast({
          title: "Đã tạo voucher",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      setShowModal(false);
      setEditVoucher(null);
      refetch();
    } catch {
      toast({
        title: "Có lỗi khi lưu voucher",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
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

  // --- LOADING TRANSITION ---
  if (isLoadingVoucher) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-0 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <FaTicketAlt className="text-blue-600 text-3xl" />
              <h2 className="text-3xl font-bold text-blue-800">Quản lý Voucher</h2>
            </div>
            <div className="text-gray-500 text-sm ml-1">
              Tạo, chỉnh sửa và quản lý các mã giảm giá của bạn.
            </div>
          </div>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-2 rounded-lg flex items-center gap-2 shadow transition"
            onClick={handleAdd}
          >
            <FaPlus />
            Thêm voucher
          </Button>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
          <h3 className="text-xl font-semibold text-blue-700 mb-4 border-b border-blue-50 pb-2">
            Danh sách voucher
          </h3>
          <VoucherTable
            vouchers={vouchers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusToggle={handleStatusToggle}
          />
        </div>
      </div>
      <VoucherModal
        show={showModal}
        modalRef={modalRef}
        editVoucher={editVoucher}
        onClose={() => {
          setShowModal(false);
          setEditVoucher(null);
        }}
        onSave={handleSave}
        onChange={handleChange}
        toDatetimeLocal={toDatetimeLocal}
      />
      <DeleteVoucherModal
        show={deleteId !== null}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default VoucherPage;