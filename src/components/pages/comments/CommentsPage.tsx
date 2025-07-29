import { useState, useRef, useEffect } from "react";
import CommentTable from "./CommentTable";
import CommentDetailModal from "./CommentDetailModal";
import DeleteCommentModal from "./DeleteCommentModal";
import { useGetProductsQuery } from "../../../redux/api/productsApi";
import { useGetProductReviewsQuery } from "../../../redux/api/reviewsApi";
import api from "../../../api/axios-client";
import { useToast } from "@chakra-ui/react";

const MAX_COMMENT_LENGTH = 50;

const CommentsPage = () => {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewDetailId, setViewDetailId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const toast = useToast();
  const { data: products = [] } = useGetProductsQuery();
  const {
    data: reviews = [],
    refetch,
    isFetching,
  } = useGetProductReviewsQuery(selectedProductId!, {
    skip: selectedProductId === null,
  });

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (deleteId === null && viewDetailId === null) return;
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setDeleteId(null);
        setViewDetailId(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [deleteId, viewDetailId]);

  const handleDelete = (id: number) => setDeleteId(id);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      await api.delete(`/reviews/${deleteId}`);
      toast({
        title: "Deleted",
        description: "Review deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setDeleteId(null);
      refetch();
    } catch (error: unknown) {
      toast({
        title: "Delete failed",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const cancelDelete = () => setDeleteId(null);

  const handleToggleStatus = async (id: number) => {
    const review = reviews.find((r: unknown) => r.id === id);
    if (!review) return;
    setActionLoading(true);
    try {
      const newStatus = review.status === "Visible" ? "Hidden" : "Visible";
      await api.patch(`/reviews/${id}/status`, { status: newStatus });
      toast({
        title: `Review ${newStatus === "Visible" ? "shown" : "hidden"}`,
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
      refetch();
    } catch (error: unknown) {
      toast({
        title: "Status update failed",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDetail = (id: number) => setViewDetailId(id);

  // Filter products by search
  const filteredProducts = products.filter((p: unknown) =>
    p.product_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <h2 className="text-3xl font-extrabold mb-8 text-blue-800 tracking-tight drop-shadow">
        Product Reviews
      </h2>
      <div className="mb-6">
        <label className="mr-2 font-semibold block mb-2 text-blue-700">Select Product:</label>
        <input
          className="border-2 border-blue-200 rounded px-3 py-2 mb-3 w-full max-w-xs focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Search product..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="w-full">
          <div
            className="
              grid 
              grid-cols-2 
              sm:grid-cols-3 
              md:grid-cols-4 
              lg:grid-cols-5 
              gap-4 
              max-h-56 
              overflow-y-auto 
              p-2 
              bg-blue-50 
              rounded-xl 
              shadow-inner
            "
            style={{ minHeight: 120 }}
          >
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-gray-400 italic text-center py-8">
                No products found.
              </div>
            )}
            {filteredProducts.map((p: unknown) => (
              <div
                key={p.id}
                className={`flex flex-col items-center cursor-pointer border-2 rounded-lg p-2 shadow-md transition-all duration-150 bg-white
                  ${selectedProductId === p.id
                    ? "border-blue-600 ring-2 ring-blue-200 scale-105"
                    : "border-gray-200 hover:border-blue-400 hover:scale-105"
                  }`}
                onClick={() => setSelectedProductId(p.id)}
                tabIndex={0}
                style={{ outline: "none" }}
              >
                <img
                  src={
                    (p.images?.find?.((img: unknown) => img.name === "main")?.url) ||
                    p.image ||
                    "/default-image.jpg"
                  }
                  alt={p.product_name}
                  className="w-16 h-16 object-cover rounded mb-2 border shadow"
                  loading="lazy"
                />
                <span className="text-xs text-center font-semibold text-blue-900 line-clamp-2">
                  {p.product_name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
        {isFetching && <div className="text-blue-600 font-semibold">Loading reviews...</div>}
        {!isFetching && selectedProductId && (
          <CommentTable
            comments={reviews.map(r => ({
              id: r.id,
              productId: selectedProductId,
              productName: products.find((p: unknown) => p.id === selectedProductId)?.product_name || "",
              user: r.user.username,
              content: r.content,
              date: new Date(r.createdAt).toLocaleDateString(),
              status: r.status,
              rating: r.rating,
            }))}
            maxCommentLength={MAX_COMMENT_LENGTH}
            onViewDetail={handleViewDetail}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
            actionLoading={actionLoading}
          />
        )}
        {!selectedProductId && <div className="text-gray-500">Please select a product to view reviews.</div>}
      </div>

      {/* View Detail Modal */}
      {viewDetailId !== null && (
        <CommentDetailModal
          comment={reviews.find((r: unknown) => r.id === viewDetailId)}
          modalRef={modalRef}
          onClose={() => setViewDetailId(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <DeleteCommentModal
          modalRef={modalRef}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
          loading={actionLoading}
        />
      )}
    </div>
  );
};

export default CommentsPage;