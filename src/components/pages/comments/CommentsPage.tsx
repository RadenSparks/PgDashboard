import { useState, useRef, useEffect } from "react";
import CommentTable from "./CommentTable";
import CommentDetailModal from "./CommentDetailModal";
import DeleteCommentModal from "./DeleteCommentModal";
import { useGetProductsQuery } from "../../../redux/api/productsApi";
import { useGetProductReviewsQuery } from "../../../redux/api/reviewsApi";
import api from "../../../api/axios-client";
import { useToast } from "@chakra-ui/react";
import type { Product } from "../../../redux/api/productsApi";
import type { Review } from "../../../redux/api/reviewsApi";
import type { AxiosError } from "axios";

// If you have a Comment type, import it. Otherwise, define it here:
type Comment = {
  id: number;
  productId: number;
  productName: string;
  user: string;
  content: string;
  date: string;
  status: "Visible" | "Hidden";
  rating: number;
};

const MAX_COMMENT_LENGTH = 50;

const CommentsPage = () => {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewDetailId, setViewDetailId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const toast = useToast();
  const { data: productsRaw } = useGetProductsQuery({ page: 1, limit: 100 });
  const products: Product[] = Array.isArray(productsRaw)
    ? productsRaw
    : Array.isArray(productsRaw?.data)
      ? productsRaw.data
      : [];

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

  // --- Fix error handling for .message property and type 'unknown' ---
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
      let message = "Unknown error";
      if (isAxiosError(error)) {
        message = error.response?.data?.message ?? message;
      } else if (isErrorWithMessage(error)) {
        message = String(error.message);
      }
      toast({
        title: "Delete failed",
        description: message,
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
    const review = reviews.find((r: Review) => r.id === id);
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
      let message = "Unknown error";
      if (isAxiosError(error)) {
        message = error.response?.data?.message ?? message;
      } else if (isErrorWithMessage(error)) {
        message = String(error.message);
      }
      toast({
        title: "Status update failed",
        description: message,
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
  const filteredProducts = products.filter((p) =>
    p.product_name?.toLowerCase().includes(search.toLowerCase())
  );

  // Find selected product for detail modal
  const selectedProduct = products.find(
    (p) => p.id === selectedProductId
  );

  // Map reviews to Comment shape for table
  const comments: Comment[] = reviews.map((r: Review) => ({
    id: r.id,
    productId: selectedProductId ?? 0,
    productName: selectedProduct?.product_name || "",
    user: r.user.username,
    content: r.content,
    date: new Date(r.createdAt).toLocaleDateString(),
    status: r.status === "Visible" ? "Visible" : "Hidden", // enforce correct type
    rating: r.rating,
  }));

  // For detail modal, map review to Comment shape
  const detailComment =
    viewDetailId !== null
      ? (() => {
          const r = reviews.find((r: Review) => r.id === viewDetailId);
          if (!r) return undefined;
          return {
            id: r.id,
            productId: selectedProductId ?? 0,
            productName: selectedProduct?.product_name || "",
            user: r.user.username,
            content: r.content,
            date: new Date(r.createdAt).toLocaleDateString(),
            status: r.status,
            rating: r.rating,
          } as Comment;
        })()
      : undefined;

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
              gap-6 
              max-h-96 
              overflow-y-auto 
              p-4 
              bg-gradient-to-br from-blue-100 to-blue-50 
              rounded-2xl 
              shadow-lg
              border border-blue-200
            "
            style={{ minHeight: 160 }}
          >
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-gray-400 italic text-center py-8">
                No products found.
              </div>
            )}
            {filteredProducts.map((p: Product) => (
              <div
                key={p.id}
                className={`flex flex-col items-center cursor-pointer border-2 rounded-xl p-3 shadow-md transition-all duration-150 bg-white
                  ${selectedProductId === p.id
                    ? "border-blue-600 ring-4 ring-blue-300 scale-105"
                    : "border-gray-200 hover:border-blue-400 hover:scale-105"
                  }`}
                onClick={() => setSelectedProductId(p.id)}
                tabIndex={0}
                style={{ outline: "none" }}
                title={p.product_name}
              >
                <img
                  src={
                    (Array.isArray(p.images)
                      ? ((p.images as { name?: string; url?: string }[]).find(img => img.name === "main")?.url)
                      : undefined) ||
                    (p as { image?: string }).image ||
                    "/default-image.jpg"
                  }
                  alt={p.product_name}
                  className="w-20 h-20 object-cover rounded-lg mb-2 border-2 border-blue-100 shadow"
                  loading="lazy"
                />
                <span className="text-sm text-center font-bold text-blue-900 line-clamp-2" style={{ maxWidth: 100 }}>
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
            comments={comments}
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
          comment={detailComment}
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
          loading={actionLoading} // <-- Make sure DeleteCommentModalProps includes 'loading'
        />
      )}
    </div>
  );
};

export default CommentsPage;

// Type guards to avoid 'any'
function isAxiosError(error: unknown): error is AxiosError<{ message?: string }> {
  return typeof error === "object" && error !== null && "isAxiosError" in error;
}
function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === "object" && error !== null && "message" in error && typeof (error as { message: unknown }).message === "string";
}