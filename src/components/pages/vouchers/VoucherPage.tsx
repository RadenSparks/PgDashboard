import { useState, useRef, useEffect } from "react";
import { Button } from "../../widgets/button";
import { FaPlus } from "react-icons/fa";
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
      status: (editVoucher.status as Voucher["status"]) || "inactive",
      milestonePoints:
        editVoucher.milestonePoints === null || editVoucher.milestonePoints === undefined
          ? null
          : Number(editVoucher.milestonePoints),
    };
    try {
      if (editVoucher.id) {
        await updateVoucher(payload);
        toast({
          title: "Voucher updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Remove id for creation
        const { id, ...createPayload } = payload;
        await addVoucher(createPayload as Omit<Voucher, "id">);
        toast({
          title: "Voucher created",
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
        title: "Failed to save voucher",
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
        <VoucherTable
          vouchers={vouchers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusToggle={handleStatusToggle}
        />
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