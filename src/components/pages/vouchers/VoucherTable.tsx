import React from "react";
import { Button } from "../../widgets/button";
import { FaEdit, FaTrash } from "react-icons/fa";
import type { Voucher } from '../../../redux/api/vounchersApi';

type VoucherTableProps = {
  vouchers: Voucher[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onStatusToggle: (id: number) => void;
};

const VoucherTable: React.FC<VoucherTableProps> = ({
  vouchers,
  onEdit,
  onDelete,
  onStatusToggle,
}) => (
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
                onClick={() => onEdit(voucher.id)}
              >
                <FaEdit className="inline mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                className="bg-red-100 text-red-700 border border-red-300 hover:bg-red-200"
                onClick={() => onDelete(voucher.id)}
              >
                <FaTrash className="inline mr-1" />
                Delete
              </Button>
              <Button
                size="sm"
                className={
                  voucher.status === "active"
                    ? "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                    : "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200"
                }
                onClick={() => onStatusToggle(voucher.id)}
              >
                {voucher.status === "active" ? "Set Inactive" : "Set Active"}
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
);

export default VoucherTable;