import { useEffect, useRef, useState } from "react";
import type { Product, NamedImage } from "./types";
import { Button } from "../../widgets/button";
import GallerySlider from "./GallerySlider";
import type { Tag } from "../tags/availableTags";
import { useGetCategoriesQuery } from "../../../redux/api/categoryApi";
import Loading from "../../../components/widgets/loading";
import type { Category } from "../categories/categoriesData";
import { useGetTagsQuery } from "../../../redux/api/tagsApi";
import MediaPicker from "../../media/MediaPicker";

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
  const { data: dataTags, isLoading: loadTags } = useGetTagsQuery();

  const genreTags = dataTags?.filter(c => c.type === 'genre') ?? [];
  const playerTags = dataTags?.filter(c => c.type === 'players') ?? [];
  const durationTags = dataTags?.filter(c => c.type === 'duration') ?? [];

  // MediaPicker state
  const [showMediaPicker, setShowMediaPicker] = useState<"main" | "gallery" | null>(null);

  // Helper for updating images array
  const updateImage = (idx: number, field: keyof NamedImage, value: string) => {
    const newImages = [...product.images];
    newImages[idx] = { ...newImages[idx], [field]: value };
    onChange({ ...product, images: newImages });
  };
  const handleDeleteImage = (id: number) => {
    const updatedImages = [...product.images];
    const data = updatedImages.filter(f => !(f.id === id));
    onChange({ ...product, images: data, deleteImages: [...(product.deleteImages ?? []), id] });
  };
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
  // Genres: multi-select, Players/Duration: single-select

  // Ensure product.tags is always an array of numbers
  const tagsArray: number[] = Array.isArray(product.tags)
    ? product.tags.map(Number)
    : [];

  const handleGenreChange = (selected: number[]) => {
    // Remove all genre tags, then add selected
    let tags = tagsArray.filter((t) => !genreTags.some((g) => g.id === t));
    tags = [...tags, ...selected];
    onChange({ ...product, tags });
  };

  const selectedGenres = genreTags
    .filter((g) => tagsArray.includes(g.id))
    .map((g) => g.id);

  const selectedPlayers =
    playerTags.find((p) => tagsArray.includes(p.id))?.id ?? "";

  const selectedDuration =
    durationTags.find((d) => tagsArray.includes(d.id))?.id ?? "";

  const handleSingleTagChange = (
    type: "players" | "duration",
    value: number
  ) => {
    let tags = [...tagsArray];
    if (type === "players") {
      tags = tags.filter((t) => !playerTags.some((p) => p.id === t));
      if (value) tags.push(value);
    } else if (type === "duration") {
      tags = tags.filter((t) => !durationTags.some((d) => d.id === t));
      if (value) tags.push(value);
    }
    onChange({ ...product, tags });
  };

  if (loadCat || loadTags) { return <Loading></Loading>; }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-y-auto">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-0 relative flex flex-row items-stretch my-12"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="w-full">
          <div className="border-b px-6 py-4 flex items-center justify-between rounded-t-xl bg-blue-50">
            <h3 className="text-xl font-bold">
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
            <section className="px-6 py-4">
              <div className="font-semibold mb-2 text-blue-700 text-sm uppercase tracking-wide">Basic Info</div>
              <div className="grid grid-cols-1 gap-3">
                <label>
                  <span className="block text-xs font-medium text-gray-600 mb-1">Name</span>
                  <input
                    className="w-full border rounded px-3 py-2"
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
                    className="w-full border rounded px-3 py-2"
                    name="slug"
                    placeholder="Slug"
                    value={product.slug}
                    onChange={e => onChange({ ...product, slug: e.target.value })}
                    required
                  />
                </label>
                <label>
                  <span className="block text-xs font-medium text-gray-600 mb-1">Description</span>
                  <textarea
                    className="w-full border rounded px-3 py-2"
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
                    className="w-full border rounded px-3 py-2"
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {/* Genre: Multi-select */}
                  <label>
                    <span className="block text-xs font-medium text-gray-600 mb-1">Genres</span>
                    <select
                      className="w-full border rounded px-3 py-2"
                      multiple
                      value={selectedGenres}
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
                      className="w-full border rounded px-3 py-2"
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
                      className="w-full border rounded px-3 py-2"
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
                </div>
                <label>
                  <span className="block text-xs font-medium text-gray-600 mb-1">Status</span>
                  <select
                    className="w-full border rounded px-3 py-2"
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
              </div>
            </section>
            {/* Inventory & Pricing */}
            <section className="px-6 py-4">
              <div className="font-semibold mb-2 text-blue-700 text-sm uppercase tracking-wide">Inventory & Pricing</div>
              <div className="grid grid-cols-2 gap-3">
                <label>
                  <span className="block text-xs font-medium text-gray-600 mb-1">Price</span>
                  <input
                    className="w-full border rounded px-3 py-2"
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
                    className="w-full border rounded px-3 py-2"
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
                    className="w-full border rounded px-3 py-2"
                    name="stock"
                    type="number"
                    placeholder="Stock"
                    value={product.quantity_stock}
                    onChange={e => onChange({ ...product, quantity_stock: parseInt(e.target.value) || 0 })}
                  />
                </label>
                <label>
                  <span className="block text-xs font-medium text-gray-600 mb-1">Sold</span>
                  <input
                    className="w-full border rounded px-3 py-2"
                    name="sold"
                    type="number"
                    placeholder="Sold"
                    value={product.quantity_sold}
                    onChange={e => onChange({ ...product, quantity_sold: parseInt(e.target.value) || 0 })}
                  />
                </label>
              </div>
            </section>
            {/* Images */}
            <section className="px-6 py-4">
              <div className="font-semibold mb-2 text-blue-700 text-sm uppercase tracking-wide">Images</div>
              <div className="grid grid-cols-1 gap-3">
                {/* Main Image */}
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Main Image</span>
                  <button
                    type="button"
                    className="bg-blue-100 text-blue-700 rounded px-3 py-2 hover:bg-blue-200"
                    onClick={() => setShowMediaPicker("main")}
                  >
                    Select from Media Library
                  </button>
                  {product.image && typeof product.image === "string" && (
                    <img src={product.image} alt="Main" className="w-14 h-14 object-cover rounded border mt-2" />
                  )}
                </label>
                {/* Gallery Images */}
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Gallery Images</span>
                  <button
                    type="button"
                    className="bg-blue-100 text-blue-700 rounded px-3 py-2 hover:bg-blue-200"
                    onClick={() => setShowMediaPicker("gallery")}
                  >
                    Select from Media Library
                  </button>
                  <div className="flex gap-3 flex-wrap mt-2">
                    {product.images?.map((imgObj, idx) => (
                      imgObj.url ? (
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
                    {product.images &&
                      product.images.find((img) => img.name === 'main') && (
                        <img
                          src={product.images.find((img) => img.name === 'main')!.url}
                          alt="Main"
                          className="w-14 h-14 object-cover rounded border"
                        />
                      )}
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Gallery</div>
                    <div className="flex gap-3 flex-wrap">
                      {product.images.map((imgObj, idx) => (
                        imgObj.url ? (
                          <div key={imgObj.id} className="relative group">
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
                    images={[
                      product.image,
                      ...product.images.map(imgObj => imgObj.url)
                    ].filter(Boolean)}
                  />
                </div>
              </div>
            </section>
            {/* Featured */}
            <section className="px-6 py-4">
              <div className="font-semibold mb-2 text-blue-700 text-sm uppercase tracking-wide">Featured</div>
              {(product.featured || []).map((item, idx) => (
                <div key={idx} className="grid grid-cols-1 gap-3">
                  <label>
                    <span className="block text-xs font-medium text-gray-600 mb-1">Meta Title</span>
                    <input
                      className="w-full border rounded px-3 py-2"
                      name="meta.title"
                      placeholder="Meta Title"
                      value={item.title}
                      onChange={e => onChange({
                        ...product,
                        featured: product.featured.map((f, i) =>
                          i === idx ? { ...f, title: e.target.value } : f
                        )
                      })}
                    />
                  </label>
                  <label>
                    <span className="block text-xs font-medium text-gray-600 mb-1">Description</span>
                    <textarea
                      className="w-full border rounded px-3 py-2"
                      name="description"
                      placeholder="Description"
                      value={item.content}
                      onChange={e => onChange({
                        ...product,
                        featured: product.featured.map((f, i) =>
                          i === idx ? { ...f, content: e.target.value } : f
                        )
                      })}
                      rows={2}
                    />
                  </label>
                  <label className="block">
                    <span className="block text-xs font-medium text-gray-600 mb-1">Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      name="featuredImage[]"
                      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
               file:rounded-lg file:border-0 file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
               border border-gray-300 rounded-md shadow-sm"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange({ ...product, featuredImage: file ? [file] : [] });
                        }
                      }}
                    />
                  </label>
                </div>
              ))}
              <button
                type="button"
                className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-semibold w-fit"
                onClick={() => onChange({ ...product, featured: [...(product.featured || []), { title: "", content: "", ord: 1 }] })}
              >
                + Add Featured
              </button>
            </section>
            {/* Meta Data */}
            <section className="px-6 py-4">
              <div className="font-semibold mb-2 text-blue-700 text-sm uppercase tracking-wide">Meta Data</div>
              <div className="grid grid-cols-1 gap-3">
                <label>
                  <span className="block text-xs font-medium text-gray-600 mb-1">Meta Title</span>
                  <input
                    className="w-full border rounded px-3 py-2"
                    name="meta.title"
                    placeholder="Meta Title"
                    value={product.meta_title}
                    onChange={e => onChange({ ...product, meta_title: e.target.value })}
                  />
                </label>
                <label>
                  <span className="block text-xs font-medium text-gray-600 mb-1">Meta Description</span>
                  <input
                    className="w-full border rounded px-3 py-2"
                    name="meta.description"
                    placeholder="Meta Description"
                    value={product.meta_description}
                    onChange={e => onChange({ ...product, meta_description: e.target.value })}
                  />
                </label>
              </div>
            </section>
            <div className="flex justify-end gap-2 px-6 py-4">
              <Button
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                type="submit"
              >
                Save
              </Button>
              <Button
                className="bg-gray-200 px-6 py-2 rounded"
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
          onSelect={imgs => {
            if (showMediaPicker === "main") {
              const img = Array.isArray(imgs) ? imgs[0] : imgs;
              onChange({ ...product, image: img.url });
            } else if (showMediaPicker === "gallery") {
              const arr = Array.isArray(imgs) ? imgs : [imgs];
              onChange({
                ...product,
                images: arr.map(i => ({ id: i.id, url: i.url, name: i.name })),
              });
            }
            setShowMediaPicker(null);
          }}
          onClose={() => setShowMediaPicker(null)}
        />
      </div>
    </div>
  );
};

export default ProductFormModal;