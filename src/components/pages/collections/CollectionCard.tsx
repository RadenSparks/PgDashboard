import { Card, CardBody, CardHeader, Heading, IconButton, Image, Text, Badge, Divider } from "@chakra-ui/react";
import { Edit, Trash2, Package } from "lucide-react";
import type { Collection } from "../../../redux/api/collectionsApi";
import type { Product } from "../../../redux/api/productsApi";

interface CollectionCardProps {
  collection: Collection;
  onEdit: (collection: Collection) => void;
  onDelete: (id: string) => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, onEdit, onDelete }) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 rounded-2xl">
    <CardHeader className="pb-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <Heading size="md" className="text-gray-900 mb-2 break-words">
            {collection.name}
          </Heading>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package size={16} />
            <span>{collection.products.length} sản phẩm</span>
          </div>
        </div>
        <div className="flex gap-2">
          <IconButton
            aria-label="Chỉnh sửa bộ sưu tập"
            icon={<Edit size={16} />}
            size="sm"
            colorScheme="blue"
            variant="ghost"
            onClick={() => onEdit(collection)}
          />
          <IconButton
            aria-label="Xóa bộ sưu tập"
            icon={<Trash2 size={16} />}
            size="sm"
            colorScheme="red"
            variant="ghost"
            onClick={() => onDelete(String(collection.id))}
          />
        </div>
      </div>
    </CardHeader>
    <CardBody className="pt-0">
      <div className="mb-4">
        <Image
          src={collection.image_url}
          alt={collection.name}
          className="w-full h-48 object-cover rounded-xl border border-gray-200"
          fallbackSrc="https://via.placeholder.com/400x300?text=Không+có+ảnh"
        />
      </div>
      <Text className="text-gray-700 mb-4 line-clamp-3">{collection.description}</Text>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Ngày tạo:</span>
          <span className="font-medium">
            {collection.createdAt
              ? new Date(collection.createdAt).toLocaleDateString()
              : ""}
          </span>
        </div>
        <Divider />
        <div>
          <Text className="text-sm font-semibold text-gray-700 mb-2">Sản phẩm:</Text>
          <div className="flex flex-wrap gap-2">
            {(collection.products as unknown as Product[]).slice(0, 3).map((product) => (
              <Badge
                key={product.id}
                colorScheme={
                  product.category_ID?.name === "Boardgame"
                    ? "blue"
                    : product.category_ID?.name === "Expansions"
                      ? "purple"
                      : "gray"
                }
                variant="solid"
                fontWeight="bold"
                fontSize="xs"
                className="rounded-lg px-2 py-1 text-xs line-clamp-2"
              >
                {product.product_name}
              </Badge>
            ))}
            {collection.products.length > 3 && (
              <Badge colorScheme="gray" variant="subtle" className="rounded-lg px-2 py-1 text-xs">
                +{collection.products.length - 3} sản phẩm khác
              </Badge>
            )}
          </div>
        </div>
        {collection.hasSpecialCoupon && (
          <Badge colorScheme="green" className="ml-2">Coupon đặc biệt</Badge>
        )}
      </div>
    </CardBody>
  </Card>
);

export default CollectionCard;