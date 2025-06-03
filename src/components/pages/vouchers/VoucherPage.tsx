import { useState } from "react";
import { Button } from "../../widgets/button";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const mockVouchers = [
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

const VoucherPage = () => {
  const [vouchers, setVouchers] = useState(mockVouchers);

  const handleAdd = () => {
    // TODO: Open add voucher modal or form
    alert("Add new voucher");
  };

  const handleEdit = (id: number) => {
    // TODO: Open edit voucher modal or form
    alert(`Edit voucher with id ${id}`);
  };

  const handleDelete = (id: number) => {
    setVouchers(vouchers.filter(v => v.id !== id));
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
    </div>
  );
};

export default VoucherPage;