import React, { useState } from "react";
import { Button } from "../../widgets/button";
import { FaEdit, FaTrash } from "react-icons/fa";
import type { Voucher } from '../../../redux/api/vounchersApi';

type VoucherTableProps = {
  vouchers: Voucher[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onStatusToggle: (id: number) => void;
};

const PAGE_SIZE = 10;

const VoucherTable: React.FC<VoucherTableProps> = ({
  vouchers,
  onEdit,
  onDelete,
  onStatusToggle,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(vouchers.length / PAGE_SIZE);
  const paginatedVouchers = vouchers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm rounded-xl overflow-hidden shadow border border-blue-100">
        <thead>
          <tr className="text-left border-b bg-blue-50">
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
          {paginatedVouchers.map((voucher, idx) => (
            <tr
              key={voucher.id}
              className={`border-b hover:bg-blue-50 transition ${
                idx % 2 === 0 ? "bg-white" : "bg-blue-50/50"
              }`}
            >
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
                      ? "bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold"
                      : voucher.status === "inactive"
                      ? "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold"
                      : "bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold"
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
          {paginatedVouchers.length === 0 && (
            <tr>
              <td colSpan={10} className="py-6 text-center text-gray-400">
                No vouchers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded font-semibold ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-200"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default VoucherTable;