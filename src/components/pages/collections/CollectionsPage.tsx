import React, { useState } from 'react';
import { Button, SimpleGrid, useDisclosure, useToast } from '@chakra-ui/react';
import { Plus } from 'lucide-react';
import { useGetProductsQuery } from '../../../redux/api/productsApi';
import { useGetCollectionsQuery, useAddCollectionMutation, useDeleteCollectionMutation, useUpdateCollectionMutation } from '../../../redux/api/collectionsApi';
import Loading from '../../../components/widgets/loading';
import CollectionCard from './CollectionCard';
import CollectionFormModal from './CollectionFormModal';
import type { Product as ApiProduct } from "../../../redux/api/productsApi";
import type { Collection as ApiCollection } from "../../../redux/api/collectionsApi";

// Use the API types throughout your component
type Product = ApiProduct;
type Collection = ApiCollection;

const CollectionsPage: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const { data: productsData, isLoading, refetch } = useGetProductsQuery({ page: 1, limit: 100 });
    const availableProducts: Product[] = Array.isArray(productsData)
        ? productsData
        : (productsData?.data ?? []);
    const { data: collections = [], isLoading: isLoadingCollection } = useGetCollectionsQuery();
    const [addCollection, { isLoading: addLoading }] = useAddCollectionMutation();
    const [deleteCollection, { isLoading: deleteLoading }] = useDeleteCollectionMutation();
    const [updateCollection, { isLoading: updateLoading }] = useUpdateCollectionMutation();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image_url: '',
        products: [] as Product[]
    });

    const [editingId, setEditingId] = useState<number | null>(null); // number, not string
    const [productSearch, setProductSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showMediaPicker, setShowMediaPicker] = useState(false);

    const categories = [
        'All',
        ...Array.from(
            new Set(
                availableProducts
                    .map((p: Product) => p.category_ID?.name ?? "")
                    .filter((cat): cat is string => !!cat)
            )
        ),
    ];

    const filteredProducts = availableProducts.filter(product => {
        const matchesSearch = product.product_name.toLowerCase().includes(productSearch.toLowerCase());
        const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || product.category_ID?.name === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleOpenModal = (collection?: Collection) => {
        if (collection) {
            setFormData({
                name: collection.name,
                description: collection.description,
                image_url: collection.image_url,
                products: collection.products as Product[]
            });
            setEditingId(collection.id); // number
        } else {
            setFormData({
                name: '',
                description: '',
                image_url: '',
                products: []
            });
            setEditingId(null);
        }
        onOpen();
    };

    const handleCloseModal = () => {
        setFormData({
            name: '',
            description: '',
            image_url: '',
            products: []
        });
        setEditingId(null);
        setProductSearch('');
        setSelectedCategory('');
        onClose();
    };

    function slugify(str: string) {
        return str
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    const handleAddProduct = (product: Product) => {
        if (!formData.products.find(p => p.id === product.id)) {
            setFormData({
                ...formData,
                products: [...formData.products, product]
            });
        }
    };

    const handleRemoveProduct = (productId: number) => {
        setFormData({
            ...formData,
            products: formData.products.filter(p => p.id !== productId)
        });
    };

    const handleSave = async () => {
        if (!formData.name || !formData.description) {
            toast({
                title: 'Lỗi',
                description: 'Vui lòng điền đầy đủ thông tin',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        if (formData.products.length <= 0) {
            toast({
                title: 'Thất bại',
                description: 'Cần ít nhất 1 sản phẩm cho bộ sưu tập',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const productIds = formData.products.map((p: Product) => Number(p.id));
        const payload = {
            name: formData.name,
            slug: slugify(formData.name),
            description: formData.description,
            image_url: formData.image_url,
            productIds,
        };

        try {
            if (editingId !== null) {
                await updateCollection({ id: editingId, ...payload }).unwrap();
                toast({
                    title: 'Thành công',
                    description: 'Cập nhật collection thành công',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                await addCollection(payload).unwrap();
                toast({
                    title: 'Thành công',
                    description: 'Tạo collection thành công',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
            refetch();
            handleCloseModal();
        } catch {
            toast({
                title: "Có lỗi xảy ra.",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    };

    const handleDelete = async (id: number) => {
        await deleteCollection(id);
        toast({
            title: 'Thành công',
            description: 'Xóa collection thành công',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        refetch();
    };

    if (isLoading || isLoadingCollection || updateLoading || deleteLoading || addLoading) {
        return <Loading />;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Quản lý bộ sưu tập</h1>
                        <p className="text-gray-600 mt-2">Tạo và quản lý các bộ sưu tập sản phẩm</p>
                    </div>
                    <Button
                        leftIcon={<Plus size={20} />}
                        colorScheme="blue"
                        size="lg"
                        onClick={() => handleOpenModal()}
                        className="shadow-lg"
                    >
                        Thêm bộ sưu tập
                    </Button>
                </div>
                <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} spacing={6}>
                    {(collections ?? []).map((collection) => (
                        <CollectionCard
                            key={collection.id}
                            collection={collection}
                            onEdit={handleOpenModal}
                            onDelete={(id: string) => handleDelete(Number(id))}
                        />
                    ))}
                </SimpleGrid>
                <CollectionFormModal
                    isOpen={isOpen}
                    onClose={handleCloseModal}
                    formData={formData}
                    setFormData={setFormData}
                    editingId={editingId !== null ? String(editingId) : null}
                    categories={categories}
                    productSearch={productSearch}
                    setProductSearch={setProductSearch}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    filteredProducts={filteredProducts}
                    handleAddProduct={handleAddProduct}
                    handleRemoveProduct={handleRemoveProduct}
                    showMediaPicker={showMediaPicker}
                    setShowMediaPicker={setShowMediaPicker}
                    handleSave={handleSave}
                    handleCloseModal={handleCloseModal}
                />
            </div>
        </div>
    );
};

export default CollectionsPage;