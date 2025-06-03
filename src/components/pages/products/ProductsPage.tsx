import { useState } from "react";
import { Button } from "../../widgets/button";
import { IoMdAdd } from "react-icons/io";

const mockProducts = [
	{
		id: 1,
		name: "UNO",
		category: "Card Game",
		price: 19.99,
		stock: 120,
		status: "Active",
		image: "https://i5.walmartimages.com/seo/Giant-UNO-Card-Game-for-Kids-Adults-and-Family-Night-108-Oversized-Cards-for-2-10-Players_a31dca6f-015a-4cd5-91f0-599908967b6c.04906de4d872e31806f519775b77ad4e.jpeg",
	},
	{
		id: 2,
		name: "7 Wonders",
		category: "Strategy Game",
		price: 59.99,
		stock: 45,
		status: "Active",
		image: "https://bizweb.dktcdn.net/100/316/286/articles/81v6x774i3l.jpeg?v=1671187787903",
	},
	{
		id: 3,
		name: "Zoo King",
		category: "Card Game",
		price: 29.99,
		stock: 0,
		status: "Out of Stock",
		image: "https://m.media-amazon.com/images/I/61+yRmkcTVL.jpg",
	},
];

const ProductsPage = () => {
	const [products] = useState(mockProducts);

	return (
		<div className="p-8">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold">Products</h2>
				<Button className="flex gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
					<IoMdAdd size={20} />
					<span>Add Product</span>
				</Button>
			</div>
			<div className="bg-white rounded-xl shadow p-6">
				<div className="overflow-x-auto">
					<table className="min-w-full text-sm">
						<thead>
							<tr className="text-left border-b">
								<th className="py-2 px-2">Image</th>
								<th className="py-2 px-2">Name</th>
								<th className="py-2 px-2">Category</th>
								<th className="py-2 px-2">Price</th>
								<th className="py-2 px-2">Stock</th>
								<th className="py-2 px-2">Status</th>
								<th className="py-2 px-2">Actions</th>
							</tr>
						</thead>
						<tbody>
							{products.map((prod) => (
								<tr key={prod.id} className="border-b hover:bg-gray-50">
									<td className="py-2 px-2">
										<img
											src={prod.image}
											alt={prod.name}
											className="w-12 h-12 object-cover rounded"
										/>
									</td>
									<td className="py-2 px-2">{prod.name}</td>
									<td className="py-2 px-2">{prod.category}</td>
									<td className="py-2 px-2">${prod.price.toFixed(2)}</td>
									<td className="py-2 px-2">{prod.stock}</td>
									<td className="py-2 px-2">
										<span
											className={
												prod.status === "Active"
													? "text-green-600 font-semibold"
													: "text-red-500 font-semibold"
											}
										>
											{prod.status}
										</span>
									</td>
									<td className="py-2 px-2 flex gap-2">
										<Button
											size="sm"
											className="bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200 px-3 py-1 rounded"
										>
											Edit
										</Button>
										<Button
											size="sm"
											className="bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 px-3 py-1 rounded"
										>
											Delete
										</Button>
									</td>
								</tr>
							))}
							{products.length === 0 && (
								<tr>
									<td colSpan={7} className="py-6 text-center text-gray-400">
										No products found.
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

export default ProductsPage;