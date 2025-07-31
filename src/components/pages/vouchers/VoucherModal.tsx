import React, { type RefObject } from "react";
import type { Voucher } from '../../../redux/api/vounchersApi';
import { Button } from '../../widgets/button';
type VoucherModalProps = {
  show: boolean;
  modalRef: RefObject<HTMLDivElement>;
  editVoucher: Partial<Voucher> | null;
  onClose: () => void;
  onSave: () => void;
  onChange: (field: keyof Voucher, value: string | number | null) => void;
  toDatetimeLocal: (value: string | Date | null) => string;
};

const VoucherModal: React.FC<VoucherModalProps> = ({
  show,
  modalRef,
  editVoucher,
  onClose,
  onSave,
  onChange,
}) => {
  if (!show || !editVoucher) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        ref={modalRef}
        className="relative bg-white rounded-xl shadow-lg w-[95%] sm:max-w-xl lg:max-w-3xl p-4 sm:p-6 mx-auto"
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
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
            onSave();
          }}
          className="space-y-4"
        >
          <label className="block text-sm font-medium mb-1">
            Code
            <input
              className="w-full border rounded-lg px-3 py-2 mt-1"
              value={editVoucher.code ?? ""}
              onChange={e => onChange("code", e.target.value)}
              required
            />
          </label>
          <div className="flex gap-4">
            <label className="block text-sm font-medium mb-1 flex-1">
              Start Date
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={editVoucher.startDate ?? ""}
                onChange={e => onChange("startDate", e.target.value)}
                required
              />
            </label>
            <label className="block text-sm font-medium mb-1 flex-1">
              End Date
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={editVoucher.endDate ?? ""}
                onChange={e => onChange("endDate", e.target.value)}
                required
              />
            </label>
          </div>
          <div className="flex gap-4">
            <label className="block text-sm font-medium mb-1 flex-1">
              Max Order Value
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={editVoucher.maxOrderValue ?? ""}
                onChange={e => onChange("maxOrderValue", Number(e.target.value))}
                required
              />
            </label>
            <label className="block text-sm font-medium mb-1 flex-1">
              Min Order Value
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={editVoucher.minOrderValue ?? ""}
                onChange={e => onChange("minOrderValue", Number(e.target.value))}
                required
              />
            </label>
          </div>
          <div className="flex gap-4">
            <label className="block text-sm font-medium mb-1 flex-1">
              Usage Limit
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={editVoucher.usageLimit ?? ""}
                onChange={e => onChange("usageLimit", Number(e.target.value))}
                required
              />
            </label>
            <label className="block text-sm font-medium mb-1 flex-1">
              Discount Percent
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={editVoucher.discountPercent ?? ""}
                onChange={e => onChange("discountPercent", Number(e.target.value))}
                required
              />
            </label>
          </div>
          <label className="block text-sm font-medium mb-1">
            Status
            <select
              className="w-full border rounded-lg px-3 py-2 mt-1"
              value={editVoucher.status ?? "active"}
              onChange={e => onChange("status", e.target.value as Voucher["status"])}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
          </label>
          <label className="block text-sm font-medium mb-1">
            Milestone Points (optional)
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 mt-1"
              value={editVoucher.milestonePoints ?? ""}
              onChange={e => onChange("milestonePoints", e.target.value === "" ? null : Number(e.target.value))}
            />
          </label>
          <label className="block text-sm font-medium mb-1">
            Description (optional)
            <input
              className="w-full border rounded-lg px-3 py-2 mt-1"
              value={editVoucher.description ?? ""}
              onChange={e => onChange("description", e.target.value)}
            />
          </label>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {editVoucher.id ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VoucherModal;