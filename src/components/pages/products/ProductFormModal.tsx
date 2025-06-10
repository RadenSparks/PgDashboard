import { useEffect, useRef } from "react";
import type { Product, NamedImage } from "./types";
import { Button } from "../../widgets/button";
import GallerySlider from "./GallerySlider";
import {
  genreTags,
  playerTags,
  durationTags,
} from "../tags/availableTags";
import type {
  GenreTag,
  PlayerTag,
  DurationTag,
} from "../tags/availableTags";
import { initialCategories, type Category } from "../categories/categoriesData";

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
  // Helper for updating images array
  const updateImage = (idx: number, field: keyof NamedImage, value: string) => {
    const newImages = [...product.images];
    newImages[idx] = { ...newImages[idx], [field]: value };
    onChange({ ...product, images: newImages });
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
  const handleGenreChange = (selected: string[]) => {
    // Remove all genre tags, then add selected
    let tags = product.tags ? [...product.tags] : [];
    tags = tags.filter((t) => !genreTags.some((g) => g.genre === t));
    tags = [...tags, ...selected];
    onChange({ ...product, tags });
  };

  const handleSingleTagChange = (
    type: "players" | "duration",
    value: string
  ) => {
    let tags = product.tags ? [...product.tags] : [];
    if (type === "players") {
      tags = tags.filter((t) => !playerTags.some((p) => p.players === t));
      if (value) tags.push(value);
    } else if (type === "duration") {
      tags = tags.filter((t) => !durationTags.some((d) => d.duration === t));
      if (value) tags.push(value);
    }
    onChange({ ...product, tags });
  };

  // Get current selected tags for each type
  const selectedGenres = product.tags
    ? genreTags.filter((g) => product.tags.includes(g.genre)).map((g) => g.genre)
    : [];
  const selectedPlayers =
    product.tags?.find((t) => playerTags.some((p) => p.players === t)) || "";
  const selectedDuration =
    product.tags?.find((t) => durationTags.some((d) => d.duration === t)) || "";

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
                    value={product.name}
                    onChange={e => onChange({ ...product, name: e.target.value })}
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
                    value={product.category}
                    onChange={e => onChange({ ...product, category: e.target.value })}
                  >
                    <option value="">Select category</option>
                    {initialCategories.map((cat: Category) => (
                      <option key={cat.id} value={cat.name}>
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
                          Array.from(e.target.selectedOptions).map(opt => opt.value)
                        )
                      }
                    >
                      {genreTags.map((tag: GenreTag) => (
                        <option key={tag.id} value={tag.genre}>
                          {tag.genre}
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
                      onChange={e => handleSingleTagChange("players", e.target.value)}
                    >
                      <option value="">Select players</option>
                      {playerTags.map((tag: PlayerTag) => (
                        <option key={tag.id} value={tag.players}>
                          {tag.players}
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
                      onChange={e => handleSingleTagChange("duration", e.target.value)}
                    >
                      <option value="">Select duration</option>
                      {durationTags.map((tag: DurationTag) => (
                        <option key={tag.id} value={tag.duration}>
                          {tag.duration}
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
                    value={product.price}
                    onChange={e => onChange({ ...product, price: parseFloat(e.target.value) || 0 })}
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
                    value={product.stock}
                    onChange={e => onChange({ ...product, stock: parseInt(e.target.value) || 0 })}
                  />
                </label>
                <label>
                  <span className="block text-xs font-medium text-gray-600 mb-1">Sold</span>
                  <input
                    className="w-full border rounded px-3 py-2"
                    name="sold"
                    type="number"
                    placeholder="Sold"
                    value={product.sold}
                    onChange={e => onChange({ ...product, sold: parseInt(e.target.value) || 0 })}
                  />
                </label>
              </div>
            </section>
            {/* Images */}
            <section className="px-6 py-4">
              <div className="font-semibold mb-2 text-blue-700 text-sm uppercase tracking-wide">Images</div>
              <div className="grid grid-cols-1 gap-3">
                <label>
                  <span className="block text-xs font-medium text-gray-600 mb-1">Main Image URL</span>
                  <input
                    className="w-full border rounded px-3 py-2"
                    name="image"
                    placeholder="Main Image URL"
                    value={product.image}
                    onChange={e => onChange({ ...product, image: e.target.value })}
                  />
                </label>
                <div>
                  <span className="block text-xs font-medium text-gray-600 mb-1">Gallery Images</span>
                  <div className="flex flex-col gap-2">
                    {product.images.map((imgObj, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          className="w-full border rounded px-3 py-2"
                          type="text"
                          value={imgObj.url}
                          placeholder={`Gallery Image URL #${idx + 1}`}
                          onChange={e => updateImage(idx, "url", e.target.value)}
                        />
                        <input
                          className="border rounded px-2 py-2 w-32"
                          type="text"
                          value={imgObj.name}
                          placeholder="Image Name"
                          onChange={e => updateImage(idx, "name", e.target.value)}
                        />
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700 text-lg"
                          onClick={() => {
                            const newImages = product.images.filter((_, i) => i !== idx);
                            onChange({ ...product, images: newImages });
                          }}
                          aria-label="Remove image"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-semibold w-fit"
                      onClick={() => onChange({ ...product, images: [...product.images, { url: "", name: "" }] })}
                    >
                      + Add Gallery Image
                    </button>
                  </div>
                </div>
                {/* Gallery Preview */}
                <div className="flex flex-col gap-2 mt-2">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Main</div>
                    {product.image && (
                      <img
                        src={product.image}
                        alt="Main"
                        className="w-14 h-14 object-cover rounded border"
                      />
                    )}
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Gallery</div>
                    <div className="flex gap-1 flex-wrap">
                      {product.images.map((imgObj, idx) => (
                        imgObj.url ? (
                          <img
                            key={idx}
                            src={imgObj.url}
                            alt={`Gallery ${idx + 1}`}
                            className="w-10 h-10 object-cover rounded border"
                          />
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
                    value={product.meta.title}
                    onChange={e => onChange({ ...product, meta: { ...product.meta, title: e.target.value } })}
                  />
                </label>
                <label>
                  <span className="block text-xs font-medium text-gray-600 mb-1">Meta Description</span>
                  <input
                    className="w-full border rounded px-3 py-2"
                    name="meta.description"
                    placeholder="Meta Description"
                    value={product.meta.description}
                    onChange={e => onChange({ ...product, meta: { ...product.meta, description: e.target.value } })}
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
      </div>
    </div>
  );
};

export default ProductFormModal;