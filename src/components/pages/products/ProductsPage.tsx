import { useRef, useEffect, useState } from "react";
import { Button } from "../../widgets/button";
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import ProductTable from "./ProductTable";
import ProductDetailsModal from "./ProductDetailsModal";
import ProductFormModal from "./ProductFormModal";
import ProductCmsModal from "./ProductCmsModal";
import type { Product, CmsContent, Tag } from "./types";
import {
    useAddProductMutation,
    useGetProductsQuery,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetProductCmsQuery,
    useUpdateProductCmsMutation
} from "../../../redux/api/productsApi";
import Loading from "../../../components/widgets/loading";
import { toaster } from "../../widgets/toaster";
import { useGetPublishersQuery } from "../../../redux/api/publishersApi";

// Main Products Page
const ProductsPage = () => {
    const { data: publishers } = useGetPublishersQuery();

    const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 10;
    const [searchTerm, setSearchTerm] = useState("");

    // Optional: Debounce search for better UX
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Fetch paginated products from backend, using 'name' for search
    const { data: paginated, isLoading } = useGetProductsQuery({
        page: currentPage,
        limit: PAGE_SIZE,
        name: debouncedSearch.trim() || undefined,
    });

    // Always pass an array to ProductTable
    const products = Array.isArray(paginated?.data)
        ? paginated.data.map((p) => {
            // If publisherID is a number or missing, find the full object from publishers list
            let publisherObj = p.publisherID;
            if (publishers) {
                if (typeof publisherObj === "number") {
                    publisherObj = publishers.find(pub => pub.id === (p.publisherID as unknown as number)) || { id: 0, name: "" };
                } else if (typeof publisherObj === "object" && publisherObj) {
                    const found = publishers.find(pub => pub.id === publisherObj.id);
                    if (found) publisherObj = found;
                }
            }
            return {
                ...p,
                category_ID: p.category_ID ?? { id: 0, name: "" },
                publisherID: publisherObj,
                images: p.images ?? [],
            };
        })
        : [];

    const totalPages = paginated
        ? Math.max(1, Math.ceil(paginated.total / paginated.limit))
        : 1;

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const [detailProduct, setDetailProduct] = useState<Product | null>(null);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [cmsProductId, setCmsProductId] = useState<number | null>(null);
    const [cmsProductContent, setCmsProductContent] = useState<CmsContent | null>(null);

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
            publisherID: { id: 0, name: "" },
            tags: [],
            images: [],
        });
        setShowAddModal(true);
    };

    const handleSaveNewProduct = async () => {
        try {
            toaster.show({ title: "Saving product...", type: "loading" });
            if (editProduct) {
                const formData = new FormData();

                // Ensure publisherID is an object with id and name
                const publisherId = typeof editProduct.publisherID === "object"
                    ? editProduct.publisherID.id
                    : editProduct.publisherID;

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
                formData.append("publisherID", publisherId?.toString() || "");
                formData.append(
                    "tags",
                    (editProduct.tags as (Tag | number)[]).map((t) => typeof t === "object" ? t.id : t).join(" ")
                );

                // Main image
                if (editProduct.mainImage instanceof File) {
                    formData.append("mainImage", editProduct.mainImage);
                }

                // Gallery images (exclude main image)
                (editProduct.images as { name?: string; file?: File }[])
                    .filter(img => img.name !== "main" && img.file instanceof File)
                    .forEach(img => {
                        formData.append('detailImages', img.file as File);
                    });

                await addProduct(formData);
                toaster.show({ title: "Product saved successfully!", type: "success" });
                setEditProduct(null);
                setShowAddModal(false);
            }
        } catch (err: unknown) {
            const errorMsg =
                typeof err === "object" && err !== null && "message" in err
                    ? String((err as { message: string }).message)
                    : "Unknown error";
            toaster.show({ title: "Failed to save product", description: errorMsg, type: "error" });
        }
    };

    // UPDATE
    const handleEdit = (prod: Product) => {
        let publisherObj = prod.publisherID;
        if (publishers) {
            if (typeof publisherObj === "number") {
                publisherObj = publishers.find(pub => pub.id === (prod.publisherID as unknown as number)) || { id: 0, name: "" };
            } else if (typeof publisherObj === "object" && publisherObj) {
                const found = publishers.find(pub => pub.id === publisherObj.id);
                if (found) publisherObj = found;
            }
        }
        setEditProduct({
            ...prod,
            publisherID: publisherObj,
            tags: prod.tags || [],
            deleteImages: [],
        });
        setShowAddModal(true);
    };

    const handleSaveEditProduct = async () => {
        try {
            toaster.show({ title: "Updating product...", type: "loading" });
            if (editProduct) {
                const formData = new FormData();

                // Ensure publisherID is an object with id and name
                const publisherId = typeof editProduct.publisherID === "object"
                    ? editProduct.publisherID.id
                    : editProduct.publisherID;

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
                formData.append("publisherID", publisherId?.toString() || "");
                formData.append(
                    "tags",
                    (editProduct.tags as (Tag | number)[]).map((t) => typeof t === "object" ? t.id : t).join(" ")
                );

                // Gallery images (exclude main image)
                (editProduct.images as { name?: string; file?: File }[])
                    .filter(img => img.name !== "main" && img.file instanceof File)
                    .forEach(img => {
                        formData.append('detailImages', img.file as File);
                    });

                // Main image
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
            const errorMsg =
                typeof err === "object" && err !== null && "message" in err
                    ? String((err as { message: string }).message)
                    : "Unknown error";
            toaster.show({ title: "Failed to update product", description: errorMsg, type: "error" });
        }
    };

    // DELETE
    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
            toaster.show({ title: "Deleting product...", type: "loading" });
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
            alert("Saved!");
            setCmsProductId(null);
        } catch (err: unknown) {
            const errorMsg =
                typeof err === "object" && err !== null && "message" in err
                    ? String((err as { message: string }).message)
                    : "Unknown error";
            alert("Failed to save: " + errorMsg);
        }
    };

    // --- Show loading spinner during transitions ---
    if (isAdding || isLoading) return <Loading />;

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                {/* Enhanced Search Bar */}
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        className="border border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg px-4 py-2 w-full pr-12 transition"
                        placeholder="Search products by name..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        aria-label="Search products"
                    />
                    <IoMdSearch
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none"
                        size={22}
                    />
                    {searchTerm && (
                        <button
                            className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
                            onClick={() => setSearchTerm("")}
                            aria-label="Clear search"
                            tabIndex={0}
                            type="button"
                        >
                            ×
                        </button>
                    )}
                </div>
                <Button
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
                    onClick={handleAddProduct}
                >
                    <IoMdAdd size={20} />
                    Add Product
                </Button>
            </div>
            <ProductTable
                products={products}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onShowDetails={setDetailProduct}
                onOpenCms={handleOpenProductCms}
            />

            {/* Product Details Modal */}
            {detailProduct && (
                <ProductDetailsModal
                    product={detailProduct}
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
