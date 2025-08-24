import { useEffect, useState } from "react";
import { Button } from "../../widgets/button";
import { FaSave, FaTimes } from "react-icons/fa";
import { type Order } from "../../../redux/api/ordersApi";
import { type Delivery } from "../../../redux/api/deliveryApi";

export interface EditOrderModalProps {
    order: Order | null;
    onClose: () => void;
    paymentTypes: string[];
    deliveryMethods: Delivery[];
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({
    order,
    onClose,
    paymentTypes,
    deliveryMethods,
}) => {
    const [editOrder, setEditOrder] = useState<Order | null>(order);

    useEffect(() => {
        setEditOrder(order);
    }, [order]);

    if (!editOrder) return null;

    const handleChange = <K extends keyof Order>(field: K, value: Order[K]) => {
        setEditOrder({ ...editOrder, [field]: value });
    };

    const handleSaveEdit = () => {
        // Implement save logic or call onSave(editOrder)
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
                    onClick={onClose}
                    aria-label="Đóng"
                >
                    <FaTimes />
                </button>
                <h3 className="text-xl font-bold mb-4">Chỉnh sửa đơn hàng</h3>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveEdit();
                    }}
                    className="space-y-4"
                >
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Hình thức thanh toán
                        </label>
                        <select
                            className="w-full border rounded px-3 py-2"
                            value={editOrder.payment_type || ""}
                            onChange={(e) =>
                                handleChange("payment_type", e.target.value)
                            }
                        >
                            <option value="">Chọn hình thức thanh toán</option>
                            {paymentTypes.map((type: string) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Phương thức giao hàng
                        </label>
                        <select
                            className="w-full border rounded px-3 py-2"
                            value={editOrder.delivery?.name || ""}
                            onChange={(e) =>
                                handleChange("delivery", { ...editOrder.delivery, name: e.target.value })
                            }
                        >
                            <option value="">Chọn phương thức giao hàng</option>
                            {deliveryMethods.map((method: { name: string }) => (
                                <option key={method.name} value={method.name}>
                                    {method.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            className="bg-gray-200 px-6 py-2 rounded"
                            type="button"
                            onClick={onClose}
                        >
                            Hủy
                        </Button>
                        <Button
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                            type="submit"
                        >
                            <FaSave className="mr-1" /> Lưu
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditOrderModal;