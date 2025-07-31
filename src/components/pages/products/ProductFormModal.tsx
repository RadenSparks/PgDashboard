import { useEffect, useRef, useState } from "react";
import type { Product, NamedImage, Tag } from "./types"; // <-- Use Tag from your local types
import { Button } from "../../widgets/button";
import GallerySlider from "./GallerySlider";
import { useGetCategoriesQuery } from "../../../redux/api/categoryApi";
import Loading from "../../../components/widgets/loading";
import { useGetTagsQuery } from "../../../redux/api/tagsApi";
import MediaPicker from "../../media/MediaPicker";
import { useGetPublishersQuery } from "../../../redux/api/publishersApi";
import { useToast } from "@chakra-ui/react";

type ProductFormModalProps = {
  product: Product;
  onChange: (product: Product) => void;
  onSave: () => void;
  onClose: () => void;
  mode: "add" | "edit";
};

const ProductFormModal = ({
  product,
  onChange,
  onSave,
  onClose,
  mode,
}: ProductFormModalProps) => {
  const { data: initialCategories, isLoading: loadCat } = useGetCategoriesQuery();
  const { data: dataTags = [], isLoading: loadTags } = useGetTagsQuery();
  const { data: publishers } = useGetPublishersQuery();
  const toast = useToast();

  const genreTags = (dataTags as Tag[]).filter((c: Tag) => c.type === 'genre');
  const playerTags = (dataTags as Tag[]).filter((c: Tag) => c.type === 'players');
  const durationTags = (dataTags as Tag[]).filter((c: Tag) => c.type === 'duration');
  const ageTags = (dataTags as Tag[]).filter((c: Tag) => c.type === 'age');

  // MediaPicker state
  const [showMediaPicker, setShowMediaPicker] = useState<"main" | "gallery" | null>(null);
  const [lastMediaFolder, setLastMediaFolder] = useState<string>("");

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  // Tag assignment handlers
  // Always keep product.tags as Tag[]
  const tagsArray: number[] = Array.isArray(product.tags)
    ? (product.tags as Tag[]).map((t) => t.id)
    : [];

  const handleGenreChange = (selected: number[]) => {
    const tags = [
      ...(dataTags as Tag[]).filter((tag) => selected.includes(tag.id)),
      ...(product.tags as Tag[]).filter((t) => !genreTags.some((g) => g.id === t.id)),
    ];
    onChange({ ...product, tags });
  };

  const selectedGenres = genreTags
    .filter((g) => tagsArray.includes(g.id))
    .map((g) => g.id);

  const selectedPlayers =
    playerTags.find((p) => tagsArray.includes(p.id))?.id ?? "";

  const selectedDuration =
    durationTags.find((d) => tagsArray.includes(d.id))?.id ?? "";

  const selectedAge =
    ageTags.find((a) => tagsArray.includes(a.id))?.id ?? "";

  const handleSingleTagChange = (
    type: "players" | "duration" | "age",
    value: number
  ) => {
    const tags = (product.tags as Tag[]).filter((t) => t.type !== type);
    if (value) {
      const tagObj = [...playerTags, ...durationTags, ...ageTags].find((t) => t.id === value);
      if (tagObj) tags.push(tagObj);
    }
    onChange({ ...product, tags });
  };

  const handleDeleteImage = (id: number) => {
    onChange({
      ...product,
      images: (product.images as NamedImage[]).filter((img) => img.id !== id),
      deleteImages: [...(product.deleteImages || []), id],
    });
  };

  const handleImageSelect = async (imgs: NamedImage[] | NamedImage) => {
    try {
      if (showMediaPicker === "main") {
        const img = Array.isArray(imgs) ? imgs[0] : imgs;
        const blob = await fetch(img.url).then((res) => res.blob());
        const file = new File([blob], img.name || "main.jpg", { type: blob.type });
        const mainImage: NamedImage = { id: img.id, url: img.url, name: "main", file, folder: img.folder ?? "" };
        const galleryImages = (product.images as NamedImage[]).filter((i) => i.name !== "main");
        onChange({
          ...product,
          images: [mainImage, ...galleryImages],
          mainImage: file,
        });
        if (typeof img.folder === "string") setLastMediaFolder(img.folder);
      } else if (showMediaPicker === "gallery") {
        const arr = Array.isArray(imgs) ? imgs : [imgs];
        const galleryImages: NamedImage[] = await Promise.all(
          arr.map(async (i) => {
            const blob = await fetch(i.url).then((res) => res.blob());
            const file = new File([blob], i.name || `gallery-${i.id}.jpg`, { type: blob.type });
            return {
              id: i.id,
              url: i.url,
              name: i.name || "",
              file,
              folder: i.folder ?? "",
            };
          })
        );
        const mainImage = (product.images as NamedImage[]).find((i) => i.name === "main");
        onChange({
          ...product,
          images: mainImage ? [mainImage, ...galleryImages] : [...galleryImages],
        });
        if (typeof arr[0]?.folder === "string") setLastMediaFolder(arr[0].folder);
      }
      setShowMediaPicker(null);
      toast({
        title: "Images updated!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Failed to update images.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  if (loadCat || loadTags) {
    return <Loading />;
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-y-auto">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-0 relative flex flex-row items-stretch my-12"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="w-full">
          <div className="border-b px-8 py-6 flex items-center justify-between rounded-t-2xl bg-blue-50">
            <h3 className="text-2xl font-bold">
              {mode === "edit" ? "Edit Product" : "Add Product"}
            </h3>
            <button
              className="text-gray-400 hover:text-gray-700 text-2xl"
              onClick={onClose}
              aria-label="Close form"
              tabIndex={0}
            >
              &times;
            </button>
          </div>
          <form
            className="divide-y"
            onSubmit={e => {
              e.preventDefault();
              onSave();
            }}
          >
            {/* Basic Info */}
            <section className="px-8 py-6">
              <div className="font-semibold mb-3 text-blue-700 text-base uppercase tracking-wide">Basic Info</div>
              <div className="grid grid-cols-1 gap-4">
                <label>
                  <span className="block text-xs font-medium text-gray-600 mb-1">Name</span>
                  <input
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"
                    name="name"
                    placeholder="Name"
                    value={product.product_name}
                    onChange={e => onChange({ ...product, product_name: e.target.value })}
                    required
                  />
                </label>
                <label>
                  <span className="block text-xs font-medium text-gray-600 mb-1">Slug</span>
                  <input
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"
                    name="slug"
                    placeholder="Slug"
                    value={product.slug}
                    onChange={e => {
                      // Replace spaces with "-" and lowercase the input
                      const formatted = e.target.value.replace(/\s+/g, "-").toLowerCase();
                      onChange({ ...product, slug: formatted });
                    }}
                    required
                  />
                </label>
                <label>
                  <span className="block text-xs font-medium text-gray-600 mb-1">Description</span>
                  <textarea
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"
                    name="description"
                    placeholder="Description"
                    value={product.description}
                    onChange={e => onChange({ ...product, description: e.target.value })}
                    rows={2}
                  />
                </label>
                <label>
                  <span className="block text-xs font-medium text-gray-600 mb-1">Category</span>
                  <select
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"
                    name="category"
                    value={product.category_ID && typeof product.category_ID === "object" ? product.category_ID.id : ""}
                    onChange={e => {
                      const selectedCat = (initialCategories || []).find(cat => cat.id === Number(e.target.value));
                      if (selectedCat) {
                        onChange({ ...product, category_ID: selectedCat });
                      }
                    }}
                    required
                  >
                    <option value="">Select category</option>
                    {(initialCategories || []).map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </label>
                {/* Tag selectors */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Genre: Multi-select */}
                  <label>
                    <span className="block text-xs font-medium text-gray-600 mb-1">Genres</span>
                    <select
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"
                      multiple
                      value={selectedGenres.map(String)}
                      onChange={e =>
                        handleGenreChange(
                          Array.from(e.target.selectedOptions).map(opt => Number(opt.value))
                        )
                      }
                    >
                      {genreTags.map((tag: Tag) => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))}
                    </select>
                    <span className="block text-xs text-gray-400 mt-1">
                      Hold Ctrl (Windows) or Cmd (Mac) to select multiple genres.
                    </span>
                  </label>
                  {/* Players: Single-select */}
                  <label>
                    <span className="block text-xs font-medium text-gray-600 mb-1">Players</span>
                    <select
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"
                      value={selectedPlayers}
                      onChange={e => handleSingleTagChange("players", Number(e.target.value))}
                    >
                      <option value="">Select players</option>
                      {playerTags.map((tag: Tag) => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  {/* Duration: Single-select */}
                  <label>
                    <span className="block text-xs font-medium text-gray-600 mb-1">Duration</span>
                    <select
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"
                      value={selectedDuration}
                      onChange={e => handleSingleTagChange("duration", Number(e.target.value))}
                    >
                      <option value="">Select duration</option>
                      {durationTags.map((tag: Tag) => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  {/* Age: Single-select */}
                  <label>
                    <span className="block text-xs font-medium text-gray-600 mb-1">Age</span>
                    <select
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"
                      value={selectedAge}
                      onChange={e => handleSingleTagChange("age", Number(e.target.value))}
                    >
                      <option value="">Select age</option>
                      {ageTags.map((tag: Tag) => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label>
                  <span className="block text-xs font-medium text-gray-600 mb-1">Status</span>
                  <select
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"
                    name="status"
                    value={product.status}
                    onChange={e => onChange({ ...product, status: e.target.value })}
                  >
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                    <option value="Coming Soon">Coming Soon</option>
                    <option value="Discontinued">Discontinued</option>
                  </select>
                </label>
                {/* Publisher: Single-select */}
                <label>
                  <span className="block text-xs font-medium text-gray-600 mb-1">Publisher</span>
                  <select
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"
                    value={
                      typeof product.publisher_ID === "object"
                        ? product.publisher_ID.id
                        : product.publisher_ID || ""
                    }
                    onChange={e => {
                      const selectedPublisher = (publishers || []).find(pub => pub.id === Number(e.target.value));
                      if (selectedPublisher) {
                        onChange({ ...product, publisher_ID: selectedPublisher });
                      }
                    }}
                  >
                    <option value="">Select publisher</option>
                    {(publishers || []).map(pub => (
                      <option key={pub.id} value={pub.id}>{pub.name}</option>
                    ))}
                  </select>
                </label>
              </div>
            </section>
            {/* Inventory & Pricing */}
            <section className="px-8 py-6">
              <div className="font-semibold mb-3 text-blue-700 text-base uppercase tracking-wide">Inventory & Pricing</div>
              <div className="grid grid-cols-2 gap-4">
                <label>
                  <span className="block text-xs font-medium text-gray-600 mb-1">Price</span>
                  <input
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"
                    name="price"
                    type="number"
                    placeholder="Price"
                    value={product.product_price}
                    onChange={e => onChange({ ...product, product_price: parseFloat(e.target.value) || 0 })}
                  />
                </label>
                <label>
                  <span className="block text-xs font-medium text-gray-600 mb-1">Discount (%)</span>
                  <input
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"
                    name="discount"
                    type="number"
                    placeholder="Discount"
                    value={product.discount}
                    onChange={e => onChange({ ...product, discount: parseFloat(e.target.value) || 0 })}
                  />
                </label>
                <label>
                  <span className="block text-xs font-medium text-gray-600 mb-1">Stock</span>
                  <input
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"
                    name="stock"
                    type="number"
                    placeholder="Stock"
                    value={product.quantity_stock}
                    onChange={e => onChange({ ...product, quantity_stock: parseInt(e.target.value) || 0 })}
                  />
                </label>
                {/* Removed Sold input for VCI compliance */}
              </div>
            </section>
            {/* Images */}
            <section className="px-8 py-6">
              <div className="font-semibold mb-3 text-blue-700 text-base uppercase tracking-wide">Images</div>
              <div className="grid grid-cols-1 gap-4">
                {/* Main Image */}
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Main Image</span>
                  <button
                    type="button"
                    className="bg-blue-100 text-blue-700 rounded px-3 py-2 hover:bg-blue-200 font-semibold"
                    onClick={() => setShowMediaPicker("main")}
                  >
                    Select from Media Library
                  </button>
                  {(product.images[0] as NamedImage)?.url && (
                    <img
                      src={(product.images[0] as NamedImage).url}
                      alt="Main"
                      className="w-14 h-14 object-cover rounded border mt-2"
                    />
                  )}
                </label>
                {/* Gallery Images */}
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Gallery Images</span>
                  <button
                    type="button"
                    className="bg-blue-100 text-blue-700 rounded px-3 py-2 hover:bg-blue-200 font-semibold"
                    onClick={() => setShowMediaPicker("gallery")}
                  >
                    Select from Media Library
                  </button>
                  <div className="flex gap-3 flex-wrap mt-2">
                    {(product.images as NamedImage[]).filter(img => img.name !== "main").map((imgObj, idx) => (
                      imgObj && "url" in imgObj && imgObj.url ? (
                        <div key={imgObj.id || idx} className="relative group">
                          <img
                            src={imgObj.url}
                            alt={`Gallery ${idx + 1}`}
                            className="w-10 h-10 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(imgObj.id)}
                            className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition"
                          >
                            x
                          </button>
                        </div>
                      ) : null
                    ))}
                  </div>
                </label>
                {/* Gallery Preview */}
                <div className="flex flex-col gap-2 mt-2">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Main</div>
                    {(product.images as NamedImage[]).find((img) => (img as NamedImage).name === "main")?.url && (
                      <img
                        src={(product.images as NamedImage[]).find((img) => (img as NamedImage).name === "main")!.url}
                        alt="Main"
                        className="w-14 h-14 object-cover rounded border"
                      />
                    )}
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Gallery</div>
                    <div className="flex gap-3 flex-wrap">
                      {(product.images as NamedImage[]).filter(img => img.name !== "main").map((imgObj, idx) => (
                        imgObj && "url" in imgObj && imgObj.url ? (
                          <div key={imgObj.id || idx} className="relative group">
                            <img
                              src={imgObj.url}
                              alt={`Gallery ${idx + 1}`}
                              className="w-10 h-10 object-cover rounded border"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteImage(imgObj.id)}
                              className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition"
                            >
                              x
                            </button>
                          </div>
                        ) : null
                      ))}
                    </div>
                  </div>
                  {/* Slider Carousel */}
                  <GallerySlider
                    images={(product.images as NamedImage[]).filter(imgObj => imgObj && "url" in imgObj && imgObj.url).map(imgObj => imgObj.url)}
                  />
                </div>
              </div>
            </section>
            {/* Meta Data */}
            <section className="px-8 py-6">
              <div className="font-semibold mb-3 text-blue-700 text-base uppercase tracking-wide">Meta Data</div>
              <div className="grid grid-cols-1 gap-4">
                <label>
                  <span className="block text-xs font-medium text-gray-600 mb-1">Meta Title</span>
                  <input
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"
                    name="meta.title"
                    placeholder="Meta Title"
                    value={product.meta_title}
                    onChange={e => onChange({ ...product, meta_title: e.target.value })}
                  />
                </label>
                <label>
                  <span className="block text-xs font-medium text-gray-600 mb-1">Meta Description</span>
                  <input
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"
                    name="meta.description"
                    placeholder="Meta Description"
                    value={product.meta_description}
                    onChange={e => onChange({ ...product, meta_description: e.target.value })}
                  />
                </label>
              </div>
            </section>
            <div className="flex justify-end gap-3 px-8 py-6">
              <Button
                className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 font-semibold text-base"
                type="submit"
              >
                Save
              </Button>
              <Button
                className="bg-gray-200 px-8 py-2 rounded-lg font-semibold text-base"
                type="button"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
        {/* MediaPicker Modal */}
        <MediaPicker
          show={!!showMediaPicker}
          multiple={showMediaPicker === "gallery"}
          folder={lastMediaFolder || product.slug}
          onSelect={(images) => handleImageSelect(images as NamedImage[] | NamedImage)}
          onClose={() => setShowMediaPicker(null)}
        />
      </div>
    </div>
  );
};

export default ProductFormModal;