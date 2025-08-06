import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  FormControl, FormLabel, Input, Textarea, Button, Image, Text, Wrap, WrapItem, Tag, TagLabel, TagCloseButton,
  InputGroup, InputLeftElement, Select, Checkbox, Badge
} from "@chakra-ui/react";
import { Search } from "lucide-react";
import type { Product } from "../../../redux/api/productsApi";
import MediaPicker from "../../media/MediaPicker";

interface CollectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    name: string;
    description: string;
    image_url: string;
    products: Product[];
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    image_url: string;
    products: Product[];
  }>>;
  editingId: string | null;
  categories: string[];
  productSearch: string;
  setProductSearch: (v: string) => void;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  filteredProducts: Product[];
  handleAddProduct: (product: Product) => void;
  handleRemoveProduct: (id: number) => void;
  showMediaPicker: boolean;
  setShowMediaPicker: (v: boolean) => void;
  handleSave: () => void;
  handleCloseModal: () => void;
}

const CollectionFormModal: React.FC<CollectionFormModalProps> = ({
  isOpen, formData, setFormData, editingId, categories, productSearch, setProductSearch,
  selectedCategory, setSelectedCategory, filteredProducts, handleAddProduct, handleRemoveProduct,
  showMediaPicker, setShowMediaPicker, handleSave, handleCloseModal
}) => (
  <Modal isOpen={isOpen} onClose={handleCloseModal} size="6xl">
    <ModalOverlay />
    <ModalContent className="max-h-[90vh] overflow-hidden rounded-2xl">
      <ModalHeader className="bg-blue-50 border-b rounded-t-2xl">
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
                className="rounded-lg"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Mô tả</FormLabel>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả collection"
                rows={4}
                className="rounded-lg"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Ảnh đại diện</FormLabel>
              <Button onClick={() => setShowMediaPicker(true)} className="rounded-lg">
                {formData.image_url ? "Đổi ảnh" : "Chọn ảnh"}
              </Button>
              {formData.image_url && (
                <Image
                  src={formData.image_url}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-xl mt-2 border border-gray-200"
                  fallbackSrc="https://via.placeholder.com/400x200?text=Invalid+URL"
                />
              )}
            </FormControl>
            {/* Selected Products */}
            <div>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Sản phẩm đã chọn ({formData.products.length}):
              </Text>
              <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto border border-gray-100">
                {formData.products.length === 0 ? (
                  <Text className="text-gray-500 text-center py-4">
                    Chưa có sản phẩm nào được chọn
                  </Text>
                ) : (
                  <Wrap spacing={2}>
                    {formData.products.map((product) => (
                      <WrapItem key={product.id}>
                        <Tag size="md" colorScheme="blue" variant="solid" className="rounded-lg">
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
                    className="rounded-lg"
                  />
                </InputGroup>
                <Select
                  placeholder="Tất cả danh mục"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-lg"
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
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto border border-gray-100">
              <div className="grid grid-cols-1 gap-3">
                {filteredProducts.map((product) => {
                  const isSelected = formData.products.find(p => p.id === product.id);
                  // Safely access image_url and category using type assertions and optional chaining
                  const imgSrc =
                    product.images && product.images[0] && (product.images[0] as { url?: string }).url
                      ? (product.images[0] as { url: string }).url
                      : (product as { image_url?: string })?.image_url
                        ? (product as { image_url?: string }).image_url
                        : "/default-image.jpg";
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
                        src={imgSrc}
                        alt={product.product_name || "Product image"}
                        className="w-14 h-14 object-cover rounded-lg border border-gray-200"
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
                          <Badge colorScheme="purple" variant="subtle" size="sm" className="rounded-lg px-2 py-1 text-xs">
                            {/* Use type assertion to access category if it exists */}
                            {(product as { category?: string }).category ?? "Không rõ"}
                          </Badge>
                          <Text className="text-sm font-semibold text-blue-600">
                            {product.product_price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                          </Text>
                          <Badge
                            colorScheme={product.quantity_stock && product.quantity_stock > 0 ? "green" : "red"}
                            variant="subtle"
                            size="sm"
                            className="rounded-lg px-2 py-1 text-xs"
                          >
                            {product.quantity_stock && product.quantity_stock > 0 ? "Còn hàng" : "Hết hàng"}
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
      <ModalFooter className="bg-gray-50 border-t rounded-b-2xl">
        <Button variant="ghost" mr={3} onClick={handleCloseModal} className="rounded-lg">
          Hủy
        </Button>
        <Button colorScheme="blue" onClick={handleSave} className="rounded-lg">
          {editingId ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </ModalFooter>
      <MediaPicker
        show={showMediaPicker}
        multiple={false}
        onSelect={(img) => {
          setFormData({ ...formData, image_url: Array.isArray(img) ? img[0].url : img.url });
          setShowMediaPicker(false);
        }}
        onClose={() => setShowMediaPicker(false)}
      />
    </ModalContent>
  </Modal>
);

export default CollectionFormModal;