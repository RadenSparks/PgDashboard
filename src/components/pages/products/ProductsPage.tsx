import { useRef, useEffect, useState } from "react";
import { Button } from "../../widgets/button";
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import ProductTable from "./ProductTable";
import ProductDetailsModal from "./ProductDetailsModal";
import ProductFormModal from "./ProductFormModal";
import ProductCmsModal from "./ProductCmsModal";
import type { Product, CmsContent, Tag } from "./types";
import { useAddProductMutation, useGetProductsQuery, useUpdateProductMutation, useDeleteProductMutation, useGetProductCmsQuery, useUpdateProductCmsMutation } from "../../../redux/api/productsApi";
import Loading from "../../../components/widgets/loading";
import { toaster } from "../../widgets/toaster";


// Main Products Page
const ProductsPage = () => {
    //Store
    const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();
    const { data: products = [], isLoading } = useGetProductsQuery() as { data: Product[], isLoading: boolean };
    //
    const [detailProduct, setDetailProduct] = useState<Product | null>(null);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [cmsProductId, setCmsProductId] = useState<number | null>(null);
    const [cmsProductContent, setCmsProductContent] = useState<CmsContent | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: fetchedCmsContent, refetch: refetchCmsContent } = useGetProductCmsQuery(cmsProductId!, { skip: cmsProductId === null });
    const [updateProductCms] = useUpdateProductCmsMutation();

    useEffect(() => {
        if (cmsProductId && fetchedCmsContent) {
            setCmsProductContent(fetchedCmsContent);
        }
    }, [cmsProductId, fetchedCmsContent]);

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!(showAddModal || editProduct)) return;
        const handleClick = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                setEditProduct(null);
                setShowAddModal(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [showAddModal, editProduct]);

    // CREATE
    const handleAddProduct = () => {
        setEditProduct({
            id: 0,
            product_name: "",
            description: "",
            product_price: 0,
            discount: 0,
            slug: "",
            meta_title: "",
            meta_description: "",
            quantity_sold: 0,
            quantity_stock: 0,
            status: "Available",
            category_ID: { id: 0, name: "" },
            publisher_ID: { id: 0, name: "" },
            tags: [],
            images: [],
        });
        setShowAddModal(true);
    };

    const handleSaveNewProduct = async () => {
        try {
            const toastId = toaster.show({ title: "Saving product...", type: "loading" });
            if (editProduct) {
                const formData = new FormData();
                formData.append("product_name", editProduct.product_name);
                formData.append("product_price", editProduct.product_price.toString());
                formData.append("description", editProduct.description);
                formData.append("discount", editProduct.discount.toString());
                formData.append("slug", editProduct.slug);
                formData.append("meta_title", editProduct.meta_title);
                formData.append("meta_description", editProduct.meta_description);
                formData.append("quantity_sold", editProduct.quantity_sold.toString());
                formData.append("quantity_stock", editProduct.quantity_stock.toString());
                formData.append("status", editProduct.status);
                formData.append("category_ID", editProduct.category_ID.id.toString());
                formData.append("publisher_ID", editProduct.publisher_ID?.id?.toString() || "");
                formData.append("tags", editProduct.tags.map((t: Tag | number) => typeof t === "object" ? t.id : t).join(" "));
                // Main image
                if (editProduct.mainImage instanceof File) {
                    formData.append("mainImage", editProduct.mainImage);
                }
                // Gallery images
                editProduct.images
                    .filter(img => img.name !== "main" && img.file instanceof File)
                    .forEach(img => {
                        formData.append('detailImages', img.file);
                    });
                await addProduct(formData);
                toaster.show({ title: "Product saved successfully!", type: "success" });
                setEditProduct(null);
                setShowAddModal(false);
            }
        } catch (err: unknown) {
            toaster.show({ title: "Failed to save product", description: err.message || "Unknown error", type: "error" });
        }
    };

    // UPDATE
    const handleEdit = (prod: Product) => {
        setEditProduct({
            ...prod,
            tags: prod.tags || [], // Ensure tags are full objects
            deleteImages: [],
        });
        setShowAddModal(true);
    };

    const handleSaveEditProduct = async () => {
        try {
            toaster.show({ title: "Updating product...", type: "loading" });
            if (editProduct) {
                const formData = new FormData();
                formData.append("id", editProduct.id.toString());
                formData.append("product_name", editProduct.product_name);
                formData.append("product_price", editProduct.product_price.toString());
                formData.append("description", editProduct.description);
                formData.append("discount", editProduct.discount.toString());
                formData.append("slug", editProduct.slug);
                formData.append("meta_title", editProduct.meta_title);
                formData.append("meta_description", editProduct.meta_description);
                formData.append("quantity_sold", editProduct.quantity_sold.toString());
                formData.append("quantity_stock", editProduct.quantity_stock.toString());
                formData.append("status", editProduct.status);
                formData.append("category_ID", editProduct.category_ID.id.toString());
                formData.append("publisher_ID", editProduct.publisher_ID?.id?.toString() || "");
                formData.append("tags", editProduct.tags.map((t: Tag | number) => typeof t === "object" ? t.id : t).join(" "));
                // Images
                editProduct.images.forEach((img) => {
                    if (img.file) formData.append('detailImages', img.file);
                });
                if (editProduct.mainImage instanceof File) {
                    formData.append("mainImage", editProduct.mainImage);
                }
                if (editProduct.deleteImages) {
                    formData.append('deleteImages', JSON.stringify(editProduct.deleteImages));
                }
                await updateProduct(formData);
                toaster.show({ title: "Product updated successfully!", type: "success" });
                setEditProduct(null);
                setShowAddModal(false);
            }
        } catch (err: unknown) {
            toaster.show({ title: "Failed to update product", description: err.message || "Unknown error", type: "error" });
        }
    };

    // DELETE
    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
            const toastId = toaster.show({ title: "Deleting product...", type: "loading" });
            await deleteProduct(id);
            toaster.show({ title: "Product deleted.", type: "success" });
        }
    };

    // FORM HANDLER
    const handleChange = (product: Product) => {
        setEditProduct(product);
    };

    // Handler for opening CMS modal for a product
    const handleOpenProductCms = (productId: number) => {
        setCmsProductId(productId);
        setTimeout(() => refetchCmsContent && refetchCmsContent(), 0);
    };

    // Handler for saving CMS content for a product
    const handleSaveProductCms = async () => {
        if (!cmsProductId || !cmsProductContent) {
            alert("No product or content to save!");
            return;
        }
        try {
            await updateProductCms({ productId: cmsProductId, data: cmsProductContent }).unwrap();
            // Optionally refetch products or CMS content here
            alert("Saved!");
            setCmsProductId(null);
        } catch (err) {
            alert("Failed to save: " + (err?.message || "Unknown error"));
        }
    };

    // Filter products by exact name match (case-insensitive)
    const filteredProducts = searchTerm.trim()
        ? products.filter(p => p.product_name.toLowerCase() === searchTerm.trim().toLowerCase())
        : products;

    if (isAdding || isLoading) return <Loading />;
    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold">Products</h2>
                <div className="flex gap-2 items-center w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            className="w-full border rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-blue-300"
                            placeholder="Search exact product name..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <IoMdSearch size={20} />
                        </span>
                    </div>
                    <Button
                        className="flex gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        onClick={handleAddProduct}
                    >
                        <IoMdAdd size={20} />
                        <span>Add Product</span>
                    </Button>
                </div>
            </div>
            <ProductTable
                products={filteredProducts}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onShowDetails={setDetailProduct}
                onOpenCms={handleOpenProductCms}
            />

            {/* Product Details Modal */}
            {detailProduct && (
                <ProductDetailsModal
                    product={detailProduct}
                    cmsContent={cmsProductContent}
                    onClose={() => setDetailProduct(null)}
                />
            )}

            {/* Add/Edit Product Modal */}
            {(showAddModal || editProduct) && editProduct && (
                <ProductFormModal
                    product={editProduct}
                    onChange={handleChange}
                    onSave={
                        editProduct.id && products.some(p => p.id === editProduct.id)
                            ? handleSaveEditProduct
                            : handleSaveNewProduct
                    }
                    onClose={() => { setEditProduct(null); setShowAddModal(false); }}
                    mode={
                        editProduct.id && products.some(p => p.id === editProduct.id)
                            ? "edit"
                            : "add"
                    }
                />
            )}

            {/* Per-Product CMS Modal */}
            {cmsProductId !== null && cmsProductContent && (
                <ProductCmsModal
                    product={products.find(p => p.id === cmsProductId)!}
                    cmsContent={cmsProductContent}
                    onChange={setCmsProductContent}
                    onSave={handleSaveProductCms}
                    onClose={() => setCmsProductId(null)}
                />
            )}
        </div>
    );
};

export default ProductsPage;
