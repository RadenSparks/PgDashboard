import React, { useState } from 'react';
import {
    Button,
    Text,
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Input,
    Textarea,
    Badge,
    useDisclosure,
    FormControl,
    FormLabel,
    Select,
    Checkbox,
    Card,
    CardBody,
    CardHeader,
    Heading,
    IconButton,
    useToast,
    Divider,
    InputGroup,
    InputLeftElement,
    SimpleGrid,
    Tag,
    TagLabel,
    TagCloseButton,
    Wrap,
    WrapItem
} from '@chakra-ui/react';
import { Search, Plus, Edit, Trash2, Package } from 'lucide-react';
import { useGetProductsQuery } from '../../../redux/api/productsApi';
import { useGetCollectionsQuery, useAddCollectionMutation, useDeleteCollectionMutation, useUpdateCollectionMutation } from '../../../redux/api/collectionsApi';
import Loading from '../../../components/widgets/loading';
interface Product {
    id: string;
    product_name: string;
    category: string;
    product_price: number;
    image_url: string;
    in_stock: boolean;
}

interface Collection {
    id: string;
    name: string;
    description: string;
    image_url: string;
    products: Product[];
    created_at: string;
}

const CollectionsPage: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const { data: availableProducts, isLoading, refetch } = useGetProductsQuery()
    const { data: collections, isLoading: isLoadingCollection } = useGetCollectionsQuery()
    const [addCollection, { isLoading: addLoading }] = useAddCollectionMutation()
    const [deleteCollection, { isLoading: updateLoading }] = useDeleteCollectionMutation()
    const [updateCollection, { isLoading: deleteLoading }] = useUpdateCollectionMutation()

    // Mock data
    // const [collections, setCollections] = useState<Collection[]>([
    //     {
    //         id: '1',
    //         name: 'Strategy Games',
    //         description: 'Các game chiến thuật hay nhất dành cho người chơi thông minh',
    //         image_url: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop',
    //         products: [
    //             { id: '1', name: 'Catan', category: 'Strategy', product_price: 850000, image_url: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=200&h=200&fit=crop', in_stock: true },
    //             { id: '2', name: 'Wingspan', category: 'Strategy', product_price: 1200000, image_url: 'https://images.unsplash.com/photo-1611891487284-8e40a7c7e0d0?w=200&h=200&fit=crop', in_stock: true }
    //         ],
    //         created_at: '2024-01-15'
    //     },
    //     {
    //         id: '2',
    //         name: 'Family Games',
    //         description: 'Những trò chơi thú vị cho cả gia đình',
    //         image_url: 'https://images.unsplash.com/photo-1611891487284-8e40a7c7e0d0?w=400&h=300&fit=crop',
    //         products: [
    //             { id: '3', name: 'Ticket to Ride', category: 'Family', product_price: 950000, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop', in_stock: true }
    //         ],
    //         created_at: '2024-01-20'
    //     }
    // ]);

    // const [availableProducts] = useState<Product[]>([
    //     { id: '1', name: 'Catan', category: 'Strategy', product_price: 850000, image_url: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=200&h=200&fit=crop', in_stock: true },
    //     { id: '2', name: 'Wingspan', category: 'Strategy', product_price: 1200000, image_url: 'https://images.unsplash.com/photo-1611891487284-8e40a7c7e0d0?w=200&h=200&fit=crop', in_stock: true },
    //     { id: '3', name: 'Ticket to Ride', category: 'Family', product_price: 950000, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop', in_stock: true },
    //     { id: '4', name: 'Azul', category: 'Strategy', product_price: 750000, image_url: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=200&h=200&fit=crop', in_stock: true },
    //     { id: '5', name: 'Splendor', category: 'Strategy', product_price: 650000, image_url: 'https://images.unsplash.com/photo-1611891487284-8e40a7c7e0d0?w=200&h=200&fit=crop', in_stock: false },
    //     { id: '6', name: 'Pandemic', category: 'Cooperative', product_price: 1100000, image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop', in_stock: true },
    //     { id: '7', name: 'Monopoly', category: 'Family', product_price: 400000, image_url: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=200&h=200&fit=crop', in_stock: true },
    //     { id: '8', name: 'Scythe', category: 'Strategy', product_price: 1800000, image_url: 'https://images.unsplash.com/photo-1611891487284-8e40a7c7e0d0?w=200&h=200&fit=crop', in_stock: true }
    // ]);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image_url: '',
        products: [] as Product[]
    });

    const [editingId, setEditingId] = useState<string | null>(null);
    const [productSearch, setProductSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const categories = ['All', 'Strategy', 'Family', 'Cooperative', 'Party', 'Card Game'];

    const filteredProducts = availableProducts?.filter(product => {
        const matchesSearch = product.product_name.toLowerCase().includes(productSearch.toLowerCase());
        const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleOpenModal = (collection?: Collection) => {
        if (collection) {
            setFormData({
                name: collection.name,
                description: collection.description,
                image_url: collection.image_url,
                products: collection.products
            });
            setEditingId(collection.id);
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
    console.log(filteredProducts)

    const handleAddProduct = (product: Product) => {
        if (!formData.products.find(p => p.id === product.id)) {
            setFormData({
                ...formData,
                products: [...formData.products, product]
            });
        }
    };

    const handleRemoveProduct = (productId: string) => {
        setFormData({
            ...formData,
            products: formData.products.filter(p => p.id !== productId)
        });
    };

    const handleSave = () => {
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

        if (editingId) {
            // setCollections(collections.map(col =>
            //     col.id === editingId
            //         ? { ...col, ...formData }
            //         : col
            // ));
            const data = new FormData();
            data.append("id", editingId);
            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("image_url", formData.image_url);
            const productIds = formData.products.map((p: { id: number }) => p.id);
            data.append("productIds", JSON.stringify(productIds));
            if (formData.products.length <= 0) {
                toast({
                    title: 'Thất bại',
                    description: 'Cần ít nhất 1 sản phẩm cho bộ sưu tâp',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                updateCollection(data)
                console.log(productIds)
                toast({
                    title: 'Thành công',
                    description: 'Cập nhật collection thành công',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }

        } else {
            const data = new FormData();
            data.append("id", formData.id);
            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("image_url", formData.image_url);
            const productIds = formData.products.map((p: { id: number }) => p.id);
            data.append("productIds", JSON.stringify(productIds));
            if (formData.products.length <= 0) {
                toast({
                    title: 'Thất bại',
                    description: 'Cần ít nhất 1 sản phẩm cho bộ sưu tâp',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                addCollection(data)
                toast({
                    title: 'Thành công',
                    description: 'Tạo collection thành công',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
        refetch()
        handleCloseModal();
    };

    const handleDelete = (id: string) => {
        deleteCollection(id)
        toast({
            title: 'Thành công',
            description: 'Xóa collection thành công',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        refetch()
    };

    const formatproduct_price = (product_price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(product_price);
    };
    if (isLoading || isLoadingCollection || updateLoading || deleteLoading || addLoading) {
        return <Loading></Loading>
    }
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Quản lý Collections</h1>
                        <p className="text-gray-600 mt-2">Tạo và quản lý các bộ sưu tập sản phẩm</p>
                    </div>
                    <Button
                        leftIcon={<Plus size={20} />}
                        colorScheme="blue"
                        size="lg"
                        onClick={() => handleOpenModal()}
                        className="shadow-lg"
                    >
                        Thêm Collection
                    </Button>
                </div>

                {/* Collections Grid */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {collections.map((collection) => (
                        <Card key={collection.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <Heading size="md" className="text-gray-900 mb-2">
                                            {collection.name}
                                        </Heading>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Package size={16} />
                                            <span>{collection.products.length} sản phẩm</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <IconButton
                                            aria-label="Edit collection"
                                            icon={<Edit size={16} />}
                                            size="sm"
                                            colorScheme="blue"
                                            variant="ghost"
                                            onClick={() => handleOpenModal(collection)}
                                        />
                                        <IconButton
                                            aria-label="Delete collection"
                                            icon={<Trash2 size={16} />}
                                            size="sm"
                                            colorScheme="red"
                                            variant="ghost"
                                            onClick={() => handleDelete(collection.id)}
                                        />
                                    </div>
                                </div>
                            </CardHeader>

                            <CardBody className="pt-0">
                                <div className="mb-4">
                                    <Image
                                        src={collection.image_url}
                                        alt={collection.name}
                                        className="w-full h-48 object-cover rounded-lg"
                                        fallbackSrc="https://via.placeholder.com/400x300?text=No+Image"
                                    />
                                </div>

                                <Text className="text-gray-700 mb-4 line-clamp-3">
                                    {collection.description}
                                </Text>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Ngày tạo:</span>
                                        <span className="font-medium">{collection.createdAt}</span>
                                    </div>

                                    <Divider />

                                    <div>
                                        <Text className="text-sm font-semibold text-gray-700 mb-2">Sản phẩm:</Text>
                                        <div className="flex flex-wrap gap-2">
                                            {collection.products.slice(0, 3).map((product) => (
                                                <Badge key={product.id} colorScheme="blue" variant="subtle">
                                                    {product.product_name}
                                                </Badge>
                                            ))}
                                            {collection.products.length > 3 && (
                                                <Badge colorScheme="gray" variant="subtle">
                                                    +{collection.products.length - 3} khác
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </SimpleGrid>

                {/* Modal */}
                <Modal isOpen={isOpen} onClose={handleCloseModal} size="6xl">
                    <ModalOverlay />
                    <ModalContent className="max-h-[90vh] overflow-hidden">
                        <ModalHeader className="bg-blue-50 border-b">
                            {editingId ? 'Chỉnh sửa Collection' : 'Thêm Collection mới'}
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody className="overflow-y-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
                                {/* Form Section */}
                                <div className="space-y-4">
                                    <FormControl isRequired>
                                        <FormLabel>Tên Collection</FormLabel>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Nhập tên collection"
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Mô tả</FormLabel>
                                        <Textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Nhập mô tả collection"
                                            rows={4}
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>URL hình ảnh</FormLabel>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setFormData({ ...formData, image_url: file });
                                                }
                                            }}
                                        />
                                    </FormControl>

                                    {/* Preview */}
                                    {formData.image_url && (
                                        <div>
                                            <Text className="text-sm font-medium text-gray-700 mb-2">Preview:</Text>
                                            <Image
                                                src={formData.image_url}
                                                alt="Preview"
                                                className="w-full h-40 object-cover rounded-lg"
                                                fallbackSrc="https://via.placeholder.com/400x200?text=Invalid+URL"
                                            />
                                        </div>
                                    )}

                                    {/* Selected Products */}
                                    <div>
                                        <Text className="text-sm font-medium text-gray-700 mb-2">
                                            Sản phẩm đã chọn ({formData.products.length}):
                                        </Text>
                                        <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                                            {formData.products.length === 0 ? (
                                                <Text className="text-gray-500 text-center py-4">
                                                    Chưa có sản phẩm nào được chọn
                                                </Text>
                                            ) : (
                                                <Wrap spacing={2}>
                                                    {formData.products.map((product) => (
                                                        <WrapItem key={product.id}>
                                                            <Tag size="md" colorScheme="blue" variant="solid">
                                                                <TagLabel>{product.product_name}</TagLabel>
                                                                <TagCloseButton onClick={() => handleRemoveProduct(product.id)} />
                                                            </Tag>
                                                        </WrapItem>
                                                    ))}
                                                </Wrap>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Products Selection */}
                                <div className="space-y-4">
                                    <div>
                                        <Text className="text-lg font-semibold text-gray-900 mb-4">
                                            Chọn sản phẩm cho collection
                                        </Text>

                                        {/* Search and Filter */}
                                        <div className="space-y-3 mb-4">
                                            <InputGroup>
                                                <InputLeftElement pointerEvents="none">
                                                    <Search className="text-gray-400" size={20} />
                                                </InputLeftElement>
                                                <Input
                                                    placeholder="Tìm kiếm sản phẩm..."
                                                    value={productSearch}
                                                    onChange={(e) => setProductSearch(e.target.value)}
                                                />
                                            </InputGroup>

                                            <Select
                                                placeholder="Tất cả danh mục"
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                            >
                                                {categories.slice(1).map(category => (
                                                    <option key={category} value={category}>
                                                        {category}
                                                    </option>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Products List */}
                                    <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                                        <div className="grid grid-cols-1 gap-3">
                                            {filteredProducts.map((product) => {
                                                const isSelected = formData.products.find(p => p.id === product.id);
                                                return (
                                                    <div
                                                        key={product.id}
                                                        className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${isSelected
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                                            }`}
                                                        onClick={() => isSelected ? handleRemoveProduct(product.id) : handleAddProduct(product)}
                                                    >
                                                        <Image
                                                            src={product.images[0].url}
                                                            alt={product.product_name}
                                                            className="w-12 h-12 object-cover rounded-md"
                                                            fallbackSrc="https://via.placeholder.com/50x50?text=No+Image"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <Text className="font-medium text-gray-900">{product.product_name}</Text>
                                                                <Checkbox
                                                                    isChecked={!!isSelected}
                                                                    colorScheme="blue"
                                                                    onChange={() => isSelected ? handleRemoveProduct(product.id) : handleAddProduct(product)}
                                                                />
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Badge colorScheme="purple" variant="subtle" size="sm">
                                                                    {product.category}
                                                                </Badge>
                                                                <Text className="text-sm font-semibold text-blue-600">
                                                                    {formatproduct_price(product.product_price)}
                                                                </Text>
                                                                <Badge
                                                                    colorScheme={product.quantity_stock ? "green" : "red"}
                                                                    variant="subtle"
                                                                    size="sm"
                                                                >
                                                                    {product.quantity_stock ? "Còn hàng" : "Hết hàng"}
                                                                </Badge>
                                                                <Badge
                                                                    colorScheme={product.collection ? "blue" : ""}
                                                                    variant="subtle"
                                                                    size="sm"
                                                                >
                                                                    {product.collection ? product.collection.name : ""}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {filteredProducts.length === 0 && (
                                            <Text className="text-center text-gray-500 py-8">
                                                Không tìm thấy sản phẩm nào
                                            </Text>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter className="bg-gray-50 border-t">
                            <Button variant="ghost" mr={3} onClick={handleCloseModal}>
                                Hủy
                            </Button>
                            <Button colorScheme="blue" onClick={handleSave}>
                                {editingId ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </div>
    );
};

export default CollectionsPage;