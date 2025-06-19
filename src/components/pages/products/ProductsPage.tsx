import { useRef, useEffect, useState } from "react";
import { Button } from "../../widgets/button";
import { IoMdAdd } from "react-icons/io";
import ProductTable from "./ProductTable";
import ProductDetailsModal from "./ProductDetailsModal";
import ProductFormModal from "./ProductFormModal";
import ProductCmsModal from "./ProductCmsModal";
import { mockProducts, emptyProduct } from "./mockProducts";
import type { Product, CmsContent } from "./types";
import { useAddProductMutation, useGetProductsQuery, useUpdateProductMutation } from "../../../redux/api/productsApi";
import Loading from "../../../components/widgets/loading";

// Main Products Page
const ProductsPage = () => {
    //Store
    const [addProduct] = useAddProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    const { data: products, isLoading } = useGetProductsQuery();
    //
    const [detailProduct, setDetailProduct] = useState<Product | null>(null);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // Per-product CMS modal state
    const [cmsProductId, setCmsProductId] = useState<number | null>(null);
    const [cmsProductContent, setCmsProductContent] = useState<CmsContent>({
        heroTitle: "",
        heroSubtitle: "",
        heroImages: [],
        aboutTitle: "",
        aboutText: "",
        aboutImages: []
    });
    const [productCmsMap, setProductCmsMap] = useState<Record<number, CmsContent>>({});

    // Delete confirmation modal state
    const [deleteProductId, setDeleteProductId] = useState<number | null>(null);

    // Modal ref for outside click
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
        setEditProduct({ ...emptyProduct });
        setShowAddModal(true);
    };

    const handleSaveNewProduct = () => {
        if (editProduct) {
            const formData = new FormData();
            formData.append("product_name", editProduct.product_name)
            formData.append("product_price", editProduct.product_price.toString())
            formData.append("description", editProduct.description)
            // formData.append("tags", editProduct.tags.join(" "))
            formData.append("tags", "1 2 3")
            formData.append("discount", editProduct.discount.toString())
            formData.append("category_ID", "1")
            // formData.append("category_ID", editProduct.category.toString())
            formData.append("publisher_ID", "1")
            formData.append("quantity_sold", editProduct.quantity_sold.toString())
            formData.append("quantity_stock", editProduct.quantity_stock.toString())
            formData.append("meta_description", editProduct.meta_description)
            formData.append("meta_title", editProduct.meta_title)
            formData.append("status", editProduct.status)
            formData.append('featured', JSON.stringify(editProduct.featured.map((f, i) => ({
                title: f.title,
                content: f.content,
                ord: String(i)
            }))));
            console.log(editProduct.featuredImage)
            editProduct.featuredImage.forEach((f) => {
                formData.append('featureImages', f);
            });
            formData.append('mainImage', editProduct.image as Blob);

            editProduct?.images.forEach((file) => {
                formData.append('detailImages', file);
            });
            for (const [key, value] of formData.entries()) {
                console.log(key, value);
            }
            // console.log(editProduct)
            addProduct(formData)
            // setProducts([
            //     { ...editProduct, id: Date.now(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            //     ...products
            // ]);
            setEditProduct(null);
            setShowAddModal(false);
        }
    };

    // UPDATE
    const handleEdit = (prod: Product) => {
        setEditProduct({ ...prod, tags: prod.tags || [], featured: prod.featured || [], deleteImages: [] });
        console.log(editProduct)
        setShowAddModal(true);
    };

    const handleSaveEditProduct = () => {
        if (editProduct) {
            const formData = new FormData();
            formData.append("id", editProduct.id.toString())
            formData.append("product_name", editProduct.product_name)
            formData.append("product_price", editProduct.product_price.toString())
            formData.append("description", editProduct.description)
            // formData.append("tags", editProduct.tags.join(" "))
            formData.append("tags", "1 2 3")
            formData.append("discount", editProduct.discount.toString())
            formData.append("category_ID", "1")
            // formData.append("category_ID", editProduct.category.toString())
            formData.append("publisher_ID", "1")
            formData.append("quantity_sold", editProduct.quantity_sold.toString())
            formData.append("quantity_stock", editProduct.quantity_stock.toString())
            formData.append("meta_description", editProduct.meta_description)
            formData.append("meta_title", editProduct.meta_title)
            formData.append("status", editProduct.status)
            formData.append('featured', JSON.stringify(editProduct.featured.map((f, i) => ({
                title: f.title,
                content: f.content,
                ord: String(i)
            }))));
            console.log(editProduct.featuredImage)
            editProduct.featuredImage?.forEach((f) => {
                formData.append('featureImages', f);
            });
            if (editProduct.image) {
                formData.append('mainImage', editProduct.image as Blob);
            }

            editProduct.images?.forEach((file) => {
                if (file instanceof Blob) {
                    formData.append('detailImages', file);
                }
            });
            if (editProduct.deleteImages) {
                formData.append('deleteImages', JSON.stringify(editProduct.deleteImages))
            }

            for (const [key, value] of formData.entries()) {
                console.log(key, value);
            }
            updateProduct(formData);
            setEditProduct(null);
            setShowAddModal(false);
        }
    };

    // DELETE (open confirmation modal)
    const handleDelete = (id: number) => {
        setDeleteProductId(id);
    };

    // Confirm delete
    const confirmDelete = () => {
        if (deleteProductId !== null) {
            // setProducts(products.filter(p => p.id !== deleteProductId));
            setDeleteProductId(null);
        }
    };

    // Cancel delete
    const cancelDelete = () => {
        setDeleteProductId(null);
    };

    // FORM HANDLER
    const handleChange = (product: Product) => {
        console.log(product)
        setEditProduct(product);
    };

    // Handler for opening CMS modal for a product
    const handleOpenProductCms = (productId: number) => {
        setCmsProductId(productId);
        setCmsProductContent(productCmsMap[productId] || {
            heroTitle: "",
            heroSubtitle: "",
            heroImages: [],
            aboutTitle: "",
            aboutText: "",
            aboutImages: []
        });
    };

    // Handler for saving CMS content for a product
    const handleSaveProductCms = () => {
        setProductCmsMap(prev => ({
            ...prev,
            [cmsProductId as number]: cmsProductContent
        }));
        setCmsProductId(null);
    };

    // const productToDelete = products.find(p => p.id === deleteProductId);
    if (isLoading) return <Loading></Loading>
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Products</h2>
                <Button
                    className="flex gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    onClick={handleAddProduct}
                >
                    <IoMdAdd size={20} />
                    <span>Add Product</span>
                </Button>
            </div>
            <ProductTable
                products={products}
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
            {cmsProductId !== null && (
                <ProductCmsModal
                    product={products.find(p => p.id === cmsProductId)!}
                    cmsContent={cmsProductContent}
                    onChange={setCmsProductContent}
                    onSave={handleSaveProductCms}
                    onClose={() => setCmsProductId(null)}
                />
            )}

            {/* Delete Confirmation Modal */}
            {/* {deleteProductId !== null && productToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-8 relative">
                        <h3 className="text-lg font-bold mb-4 text-red-600">Delete Product</h3>
                        <p className="mb-4">
                            Are you sure you want to delete <span className="font-semibold">{productToDelete.name}</span>?<br />
                            <span className="text-sm text-gray-500">This action cannot be undone.</span>
                        </p>
                        <div className="flex justify-end gap-2">
                            <Button
                                className="bg-gray-200 px-6 py-2 rounded"
                                type="button"
                                onClick={cancelDelete}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                                type="button"
                                onClick={confirmDelete}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default ProductsPage;
