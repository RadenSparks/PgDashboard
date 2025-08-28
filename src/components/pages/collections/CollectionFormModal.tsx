import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  FormControl, FormLabel, Input, Textarea, Button, Image, Text, TagCloseButton,
  InputGroup, InputLeftElement, Select, Switch, NumberInputField, FormHelperText,
  Box, Flex, useBreakpointValue,
  Tag,
  NumberInput
} from "@chakra-ui/react";
import { Search } from "lucide-react";
import type { Product as ApiProduct, Product } from "../../../redux/api/productsApi";
import MediaPicker from "../../media/MediaPicker";
import { Badge } from "../../widgets/badge";
import type { Voucher } from "@/redux/api/vounchersApi";
import { normalizeProducts } from './normalizeProducts';

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

type CollectionFormData = {
    name: string;
    description: string;
    image_url: string;
    products: Product[];
    hasSpecialCoupon: boolean;
    baseDiscountPercent: number;
    incrementPerExpansion: number;
    specialCouponId: number | undefined;
};

interface CollectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: CollectionFormData;
  setFormData: React.Dispatch<React.SetStateAction<CollectionFormData>>;
  editingId: string | null;
  categories: string[];
  allCategories: { id: number; name: string; deletedAt?: string | null }[]; // <-- add this
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
  specialCoupons: Voucher[];
}

const CollectionFormModal: React.FC<CollectionFormModalProps> = ({
  isOpen, formData, setFormData, editingId, categories, allCategories, productSearch, setProductSearch,
  selectedCategory, setSelectedCategory, filteredProducts, handleAddProduct, handleRemoveProduct,
  showMediaPicker, setShowMediaPicker, handleSave, handleCloseModal, specialCoupons
}) => {
  // Normalize products for compatibility with grouping helpers
  const normalizedProducts = normalizeProducts(filteredProducts, allCategories);
  const { baseGames, expansions } = groupProductsByBaseGame(normalizedProducts);
  const normalizedSelectedProducts = normalizeProducts(formData.products as ApiProduct[], allCategories);

  // Responsive modal size
  const modalSize = useBreakpointValue({ base: "full", md: "6xl", xl: "7xl" });

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} size={modalSize}>
      <ModalOverlay />
      <ModalContent
        className="max-h-[95vh] overflow-hidden rounded-2xl shadow-2xl border border-blue-100"
        maxW="90vw"
        minW={{ base: "98vw", md: "90vw", xl: "80vw" }}
      >
        <ModalHeader className="bg-blue-50 border-b rounded-t-2xl font-bold text-xl text-blue-900">
          {editingId ? 'Chỉnh sửa bộ sưu tập' : 'Thêm bộ sưu tập mới'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          className="bg-white"
          style={{
            overflow: "hidden",
            maxHeight: "calc(95vh - 120px)", // keep modal from growing too tall
            minHeight: 400,
          }}
        >
          <Flex
            direction={{ base: "column", xl: "row" }}
            gap={10}
            height="100%"
            minH={400}
          >
            {/* Form Section */}
            <Box
              flex="1"
              minW={0}
              overflowY="auto"
              maxH={{ base: "none", xl: "calc(80vh - 120px)" }}
              pr={{ xl: 2 }}
            >
              <Box bg="gray.50" p={8} rounded="xl" shadow="sm" border="1px solid" borderColor="gray.100">
                <FormControl isRequired mb={6}>
                  <FormLabel fontWeight="bold" color="gray.700" className="truncate" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    Tên bộ sưu tập
                  </FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nhập tên bộ sưu tập"
                    className="rounded-lg"
                  />
                </FormControl>
                <FormControl isRequired mb={6}>
                  <FormLabel fontWeight="bold" color="gray.700" className="truncate" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    Mô tả
                  </FormLabel>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Nhập mô tả bộ sưu tập"
                    rows={4}
                    className="rounded-lg"
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel fontWeight="bold" color="gray.700">Ảnh đại diện</FormLabel>
                  <Button onClick={() => setShowMediaPicker(true)} className="rounded-lg" colorScheme="blue" size="sm">
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
                <FormControl display="flex" alignItems="center" mt={4} mb={2}>
                  <FormLabel htmlFor="hasSpecialCoupon" mb="0" fontWeight="bold" color="gray.700">
                    Áp dụng voucher đặc biệt?
                  </FormLabel>
                  <Switch
                    id="hasSpecialCoupon"
                    isChecked={formData.hasSpecialCoupon}
                    onChange={e => {
                      const checked = e.target.checked;
                      setFormData({
                        ...formData,
                        hasSpecialCoupon: checked,
                        specialCouponId: checked ? formData.specialCouponId : undefined,
                        baseDiscountPercent: checked && formData.specialCouponId
                          ? (specialCoupons.find(v => v.id === formData.specialCouponId)?.discountPercent ?? 0)
                          : 0,
                      });
                    }}
                    colorScheme="green"
                  />
                </FormControl>
                {formData.hasSpecialCoupon && (
                  <>
                    <FormControl mt={2} mb={2}>
                      <FormLabel fontWeight="bold" color="gray.700">Voucher đặc biệt</FormLabel>
                      <Select
                        value={formData.specialCouponId ?? ""}
                        onChange={e => {
                          const selectedId = Number(e.target.value) || undefined;
                          const selectedVoucher = specialCoupons.find(v => v.id === selectedId);
                          setFormData({
                            ...formData,
                            specialCouponId: selectedId,
                            baseDiscountPercent: selectedVoucher?.discountPercent ?? 0,
                          });
                        }}
                        placeholder="Không chọn"
                        className="rounded-lg"
                      >
                        {(specialCoupons || [])
                          .filter(v => !v.collectionId || v.collectionId === (editingId ? Number(editingId) : undefined))
                          .map(voucher => (
                            <option key={voucher.id} value={voucher.id}>
                              {voucher.code} - {voucher.discountPercent}%
                            </option>
                          ))}
                      </Select>
                      <FormHelperText>
                        Voucher này sẽ được áp dụng đặc biệt cho bộ sưu tập này.
                      </FormHelperText>
                    </FormControl>
                    {formData.specialCouponId && (
                      <>
                        <FormControl mt={2}>
                          <FormLabel fontWeight="bold" color="gray.700">% Giảm giá cơ bản</FormLabel>
                          <NumberInput
                            min={1}
                            max={100}
                            value={formData.baseDiscountPercent}
                            isReadOnly
                          >
                            <NumberInputField />
                          </NumberInput>
                        </FormControl>
                        <FormControl mt={2}>
                          <FormLabel fontWeight="bold" color="gray.700">% Tăng thêm mỗi sản phẩm bổ sung</FormLabel>
                          <NumberInput
                            min={0}
                            max={100}
                            value={formData.incrementPerExpansion}
                            onChange={(_, value) => setFormData({ ...formData, incrementPerExpansion: value })}
                          >
                            <NumberInputField />
                          </NumberInput>
                        </FormControl>
                      </>
                    )}
                  </>
                )}
                <Box mt={8}>
                  <Text className="text-base font-semibold text-gray-800 mb-2">
                    Sản phẩm đã chọn ({formData.products.length}):
                  </Text>
                  <Box
                    bg="white"
                    rounded="lg"
                    p={3}
                    maxH="260px"
                    overflowY="auto"
                    border="1px solid"
                    borderColor="gray.200"
                    shadow="xs"
                  >
                    {formData.products.length === 0 ? (
                      <Text className="text-gray-400 text-center py-4">
                        Chưa có sản phẩm nào được chọn
                      </Text>
                    ) : (
                      <Box as="ul" className="space-y-2">
                        {/* Sort: base game first, then others */}
                        {normalizedSelectedProducts.filter(p => p.category_ID?.name === "Boardgame").map((product) => (
                          <Flex
                            as="li"
                            key={product.id}
                            align="center"
                            gap={3}
                            px={2}
                            py={1}
                            borderRadius="md"
                            _hover={{ bg: "gray.50" }}
                            className={`group`}
                            style={{ border: "2px solid #2563eb", background: "#eff6ff" }}
                          >
                            {/* --- Boardgame badge --- */}
                            <Badge
                              variant="default"
                              className="mr-1"
                              style={{
                                fontWeight: "bold",
                                color: "#fff",
                                background: "#2563eb",
                                minWidth: 80,
                                textAlign: "center",
                                fontSize: "0.75rem",
                                padding: "2px 8px",
                                display: "inline-block",
                              }}
                            >
                              Boardgame
                            </Badge>
                            <Text
                              flex="1"
                              className="truncate"
                              fontWeight="bold"
                              color="blue.800"
                              title={product.product_name}
                            >
                              {product.product_name}
                            </Text>
                            <Tag>
                              <TagCloseButton
                                onClick={() => handleRemoveProduct(product.id)}
                                className="opacity-60 group-hover:opacity-100"
                                aria-label="Xóa"
                              />
                            </Tag>
                          </Flex>
                        ))}
                        {normalizedSelectedProducts.filter(p => p.category_ID?.name !== "Boardgame").map((product) => {
                          const isBaseGame = product.category_ID?.name === "Boardgame";
                          return (
                            <Flex
                              as="li"
                              key={product.id}
                              align="center"
                              gap={3}
                              px={2}
                              py={1}
                              borderRadius="md"
                              _hover={{ bg: "gray.50" }}
                              className={`group ${isBaseGame ? "ring-2 ring-blue-400 bg-blue-50" : ""}`}
                              style={isBaseGame ? { border: "2px solid #2563eb", background: "#eff6ff" } : {}}
                            >
                              {/* --- Boardgame badge --- */}
                              {isBaseGame && (
                                <Badge
                                  variant="default"
                                  className="mr-1"
                                  style={{
                                    fontWeight: "bold",
                                    color: "#fff",
                                    background: "#2563eb",
                                    minWidth: 80,
                                    textAlign: "center",
                                    fontSize: "0.75rem",
                                    padding: "2px 8px",
                                    display: "inline-block",
                                  }}
                                >
                                  Boardgame
                                </Badge>
                              )}
                              {/* --- Expansion badge --- */}
                              {!isBaseGame && product.category_ID?.name === "Expansions" && (
                                <Badge
                                  variant="default"
                                  className="mr-1"
                                  style={{
                                    fontWeight: "bold",
                                    color: "#fff",
                                    background: "#9333ea",
                                    minWidth: 80,
                                    textAlign: "center",
                                    fontSize: "0.75rem",
                                    padding: "2px 8px",
                                    display: "inline-block",
                                  }}
                                >
                                  Mở rộng
                                </Badge>
                              )}
                              {/* --- Unknown badge --- */}
                              {!isBaseGame && product.category_ID?.name !== "Expansions" && (
                                <Badge
                                  variant="default"
                                  className="mr-1"
                                  style={{
                                    fontWeight: "bold",
                                    color: "#fff",
                                    background: "#8a6dacff",
                                    minWidth: 80,
                                    textAlign: "center",
                                    fontSize: "0.75rem",
                                    padding: "2px 8px",
                                    display: "inline-block",
                                  }}
                                >
                                  {product.category_ID?.name || "Không rõ"}
                                </Badge>
                              )}
                              <Text
                                flex="1"
                                className="truncate"
                                fontWeight={isBaseGame ? "bold" : "medium"}
                                color={isBaseGame ? "blue.800" : "gray.900"}
                                title={product.product_name}
                              >
                                {product.product_name}
                              </Text>
                              <Tag>
                                <TagCloseButton
                                  onClick={() => handleRemoveProduct(product.id)}
                                  className="opacity-60 group-hover:opacity-100"
                                  aria-label="Xóa"
                                />
                              </Tag>
                            </Flex>
                          );
                        })}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
            {/* Product Selection Section */}
            <Box
              flex="1"
              minW={0}
              bg="gray.50"
              p={6}
              rounded="xl"
              shadow="sm"
              border="1px solid"
              borderColor="gray.100"
              overflowY="auto"
              maxH={{ base: "none", xl: "calc(80vh - 120px)" }}
            >
              <Text className="text-lg font-bold text-blue-900 mb-4">
                Chọn sản phẩm cho bộ sưu tập
              </Text>
              {/* Search and Filter */}
              <Flex gap={3} mb={4}>
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
                  maxW="200px"
                >
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </Flex>
              {/* Grouped products by base game */}
              <Box
                className="bg-white rounded-lg p-4 border border-gray-100 shadow-xs"
                style={{ maxHeight: 400, overflowY: "auto" }}
              >
                {Object.values(baseGames).map(baseGame => (
                  <Box key={baseGame.id} mb={6} borderWidth="1px" borderRadius="lg" p={4} bg="gray.50">
                    <Flex align="center" justify="space-between" mb={2}>
                      <span className="font-bold flex items-center gap-2">
                        <Badge
                          variant="destructive"
                          className="text-xs px-2"
                          style={{ fontSize: "0.75rem", paddingLeft: "8px", paddingRight: "8px" }}
                        >
                          Boardgame
                        </Badge>
                        <span className="text-blue-700">{baseGame.product_name}</span>
                      </span>
                      <Flex gap={2}>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={() => handleAddProduct(baseGame)}
                          disabled={formData.products.some(p => p.id === baseGame.id)}
                        >
                          Thêm Game
                        </Button>
                        {expansions[baseGame.slug]?.length > 0 && (
                          <Button
                            size="sm"
                            colorScheme="purple"
                            onClick={() => {
                              expansions[baseGame.slug].forEach(exp => {
                                if (!formData.products.some(p => p.id === exp.id)) {
                                  handleAddProduct(exp);
                                }
                              });
                            }}
                          >
                            Thêm tất cả mở rộng
                          </Button>
                        )}
                      </Flex>
                    </Flex>
                    {/* Expansions for this base game */}
                    {expansions[baseGame.slug]?.length > 0 && (
                      <Box ml={4}>
                        <span className="text-sm text-gray-600 font-semibold">Bản mở rộng:</span>
                        <Flex flexWrap="wrap" gap={2} mt={1}>
                          {expansions[baseGame.slug].map(exp => (
                            <Button
                              key={exp.id}
                              size="xs"
                              colorScheme="purple"
                              variant={formData.products.some(p => p.id === exp.id) ? "solid" : "outline"}
                              onClick={() => handleAddProduct(exp)}
                              disabled={formData.products.some(p => p.id === exp.id)}
                              className="flex items-center gap-1"
                              style={{
                                maxWidth: 120,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                              }}
                              title={exp.product_name}
                            >
                              <Badge
                                variant="default"
                                style={{ fontSize: "0.75rem", paddingLeft: "8px", paddingRight: "8px" }}
                              >
                                Mở rộng
                              </Badge>
                              {exp.product_name}
                            </Button>
                          ))}
                      </Flex>
                      </Box>
                    )}
                  </Box>
                ))}
                {/* Products not in any base game group */}
                {normalizedProducts.filter(
                  p =>
                    p.category_ID?.name !== "Boardgame" &&
                    !Object.values(expansions).flat().some(e => e.id === p.id)
                ).map(prod => (
                  <Flex key={prod.id} mb={2} align="center" justify="space-between" borderWidth="1px" borderRadius="lg" p={2} bg="gray.50">
                    <span className="flex items-center gap-2">
                      <Badge
                        variant="destructive"
                        className="text-xs px-2"
                        style={{ fontSize: "0.75rem", paddingLeft: "8px", paddingRight: "8px" }}
                      >
                        {prod.category_ID?.name || "Không rõ"}
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
                  </Flex>
                ))}
              </Box>
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter className="bg-blue-50 border-t rounded-b-2xl">
          <Button variant="ghost" mr={3} onClick={handleCloseModal} className="rounded-lg">
            Hủy
          </Button>
          <Button colorScheme="blue" onClick={handleSave} className="rounded-lg font-bold">
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