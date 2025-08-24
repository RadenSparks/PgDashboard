import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  FormControl, FormLabel, Input, Textarea, Button, Image, Text, Wrap, WrapItem, Tag, TagLabel, TagCloseButton,
  InputGroup, InputLeftElement, Select
} from "@chakra-ui/react";
import { Search } from "lucide-react";
import type { Product as ApiProduct } from "../../../redux/api/productsApi";
import MediaPicker from "../../media/MediaPicker";
import { Badge } from "../../widgets/badge";

// Type normalization utility
function normalizeProducts(products: ApiProduct[]): ApiProduct[] {
  return products.map(p => ({
    ...p,
    category_ID: p.category_ID ?? { id: 0, name: "Unknown" },
    tags: Array.isArray(p.tags) ? p.tags : [],
  }));
}

// Helper: group products by base game (works with ApiProduct)
function getBaseSlug(slug: string): string {
  const match = slug.match(/^(.+)-.+$/);
  return match ? match[1] : slug;
}
function groupProductsByBaseGame(products: ApiProduct[]) {
  const baseGames: { [slug: string]: ApiProduct } = {};
  const expansions: { [baseSlug: string]: ApiProduct[] } = {};

  products.forEach(prod => {
    if (prod.category_ID?.name === "Boardgame") {
      baseGames[prod.slug] = prod;
    } else if (prod.category_ID?.name === "Expansions") {
      const baseSlug = getBaseSlug(prod.slug);
      if (!expansions[baseSlug]) expansions[baseSlug] = [];
      expansions[baseSlug].push(prod);
    }
  });

  return { baseGames, expansions };
}

interface CollectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    name: string;
    description: string;
    image_url: string;
    products: ApiProduct[];
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    image_url: string;
    products: ApiProduct[];
  }>>;
  editingId: string | null;
  categories: string[];
  productSearch: string;
  setProductSearch: (v: string) => void;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  filteredProducts: ApiProduct[];
  handleAddProduct: (product: ApiProduct) => void;
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
}) => {
  // Normalize products for compatibility with grouping helpers
  const normalizedProducts = normalizeProducts(filteredProducts);
  const { baseGames, expansions } = groupProductsByBaseGame(normalizedProducts);

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} size="6xl">
      <ModalOverlay />
      <ModalContent className="max-h-[90vh] overflow-hidden rounded-2xl">
        <ModalHeader className="bg-blue-50 border-b rounded-t-2xl">
          {editingId ? 'Chỉnh sửa bộ sưu tập' : 'Thêm bộ sưu tập mới'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody className="overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
            {/* Form Section */}
            <div className="space-y-4">
              <FormControl isRequired>
                <FormLabel>Tên bộ sưu tập</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên bộ sưu tập"
                  className="rounded-lg"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Mô tả</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Nhập mô tả bộ sưu tập"
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
                    alt="Xem trước"
                    className="w-full h-40 object-cover rounded-xl mt-2 border border-gray-200"
                    fallbackSrc="https://via.placeholder.com/400x200?text=Không+có+ảnh"
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
                          <Badge variant={product.category_ID?.name === "Boardgame" ? "default" : "secondary"} className="mr-1">
                            {product.category_ID?.name === "Boardgame" ? "Boardgame" : product.category_ID?.name === "Expansions" ? "Bản mở rộng" : "Khác"}
                          </Badge>
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
            {/* Product Selection Section */}
            <div className="space-y-4">
              <div>
                <Text className="text-lg font-semibold text-gray-900 mb-4">
                  Chọn sản phẩm cho bộ sưu tập
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
              {/* Grouped products by base game */}
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto border border-gray-100">
                {Object.values(baseGames).map(baseGame => (
                  <div key={baseGame.id} className="mb-6 border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Boardgame</Badge>
                        <span className="text-blue-700">{baseGame.product_name}</span>
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={() => handleAddProduct(baseGame)}
                          disabled={formData.products.some(p => p.id === baseGame.id)}
                        >
                          Thêm base game
                        </Button>
                        {expansions[baseGame.slug]?.length > 0 && (
                          <Button
                            size="sm"
                            colorScheme="yellow"
                            onClick={() => {
                              expansions[baseGame.slug].forEach(exp => {
                                if (!formData.products.some(p => p.id === exp.id)) {
                                  handleAddProduct(exp);
                                }
                              });
                            }}
                          >
                            Thêm tất cả bản mở rộng
                          </Button>
                        )}
                      </div>
                    </div>
                    {/* Expansions for this base game */}
                    {expansions[baseGame.slug]?.length > 0 && (
                      <div className="ml-4">
                        <span className="text-sm text-gray-600 font-semibold">Bản mở rộng:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {expansions[baseGame.slug].map(exp => (
                            <Button
                              key={exp.id}
                              size="xs"
                              colorScheme="gray"
                              variant={formData.products.some(p => p.id === exp.id) ? "solid" : "outline"}
                              onClick={() => handleAddProduct(exp)}
                              disabled={formData.products.some(p => p.id === exp.id)}
                              className="flex items-center gap-1"
                            >
                              <Badge variant="secondary">Bản mở rộng</Badge>
                              {exp.product_name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {/* Products not in any base game group (e.g. standalone expansions or others) */}
                {normalizedProducts.filter(
                  p =>
                    p.category_ID?.name !== "Boardgame" &&
                    !Object.values(expansions).flat().some(e => e.id === p.id)
                ).map(prod => (
                  <div key={prod.id} className="mb-2 flex items-center justify-between border rounded-lg p-2">
                    <span className="flex items-center gap-2">
                      <Badge variant={prod.category_ID?.name === "Expansions" ? "secondary" : "outline"}>
                        {prod.category_ID?.name === "Expansions" ? "Bản mở rộng" : "Khác"}
                      </Badge>
                      {prod.product_name}
                    </span>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleAddProduct(prod)}
                      disabled={formData.products.some(p => p.id === prod.id)}
                    >
                      Thêm
                    </Button>
                  </div>
                ))}
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
};

export default CollectionFormModal;