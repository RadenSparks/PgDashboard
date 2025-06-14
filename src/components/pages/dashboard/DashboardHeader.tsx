import { Button } from "../../widgets/button";
import { IoMdAdd } from "react-icons/io";

const DashboardHeader = () => (
  <div className="flex justify-between items-center">
    <h2 className="text-dark font-semibold text-4xl">Pengoo Dashboard</h2>
    <Button className="flex gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
      <IoMdAdd size={20} />
      <span>Add Product</span>
    </Button>
  </div>
);

export default DashboardHeader;