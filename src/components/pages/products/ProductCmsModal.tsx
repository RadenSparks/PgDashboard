/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import type { Product, CmsContent, TabSection, FeaturedSection } from "./types";
import { Button } from "../../widgets/button";
import MediaPicker from "../../media/MediaPicker";
import ProductCmsSidebar from "./ProductCmsSidebar";

const FONT_FAMILIES = [
  { label: "Sans-serif", value: "sans-serif" },
  { label: "Serif", value: "serif" },
  { label: "Monospace", value: "monospace" },
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Roboto", value: "Roboto, sans-serif" },
];
const FONT_SIZES = [
  { label: "Base", value: "text-base" },
  { label: "Large", value: "text-lg" },
  { label: "Extra Large", value: "text-2xl" },
];
const COLORS = ["#222", "#000", "#333", "#666", "#888", "#fff", "#f00", "#0f0", "#00f", "#ff0", "#0ff", "#f0f"];
const BG_COLORS = ["#fff", "#f9fafb", "#f3f4f6", "#e5e7eb", "#f0fdf4", "#fef3c7", "#f3f0ff", "#f0f0f0"];

type ProductCmsModalProps = {
  product: Product;
  cmsContent: CmsContent;
  onChange: (content: CmsContent) => void;
  onSave: () => void;
  onClose: () => void;
};

const ProductCmsModal = ({
  product,
  cmsContent,
  onChange,
  onSave,
  onClose,
}: ProductCmsModalProps) => {
  const [showMediaPicker, setShowMediaPicker] = useState<null | { field: keyof CmsContent | "tabImages" | "heroImages" | "featuredSections"; tabIdx?: number; imgIdx?: number; idx?: number }>(null);

  // Preview customization state
  const [fontFamily, setFontFamily] = useState(cmsContent.fontFamily || "sans-serif");
  const [fontSize, setFontSize] = useState(cmsContent.fontSize || "text-lg");
  const [previewTextColor, setPreviewTextColor] = useState(cmsContent.textColor || "#222");
  const [previewBgColor, setPreviewBgColor] = useState(cmsContent.bgColor || "#fff");

  // Helper for updating array fields
  const removeArrayItem = (field: keyof CmsContent, idx: number) => {
    const arr = [...(cmsContent[field] as string[] || [])];
    arr.splice(idx, 1);
    onChange({ ...cmsContent, [field]: arr });
  };

  const addArrayItem = (field: keyof CmsContent) => {
    const arr = [...(cmsContent[field] as string[] || []), ""];
    onChange({ ...cmsContent, [field]: arr });
  };

  // Tab management
  const tabs: TabSection[] = cmsContent.tabs || [];
  const updateTab = (idx: number, tab: TabSection) => {
    const newTabs = [...tabs];
    newTabs[idx] = tab;
    onChange({ ...cmsContent, tabs: newTabs });
  };

  // Tab image helpers
  const addTabImage = (tabIdx: number) => {
    const tab = { ...tabs[tabIdx] };
    tab.images = [...(tab.images || []), ""];
    updateTab(tabIdx, tab);
    setShowMediaPicker({ field: "tabImages", tabIdx, imgIdx: tab.images.length });
  };
  const removeTabImage = (tabIdx: number, imgIdx: number) => {
    const tab = { ...tabs[tabIdx] };
    const images = [...(tab.images || [])];
    images.splice(imgIdx, 1);
    tab.images = images;
    updateTab(tabIdx, tab);
  };

  // Sync preview customization with CMS content
  const handlePreviewChange = () => {
    onChange({
      ...cmsContent,
      fontFamily,
      fontSize,
      textColor: previewTextColor,
      bgColor: previewBgColor,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-y-auto">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full p-0 relative my-12 flex flex-col md:flex-row overflow-hidden"
        style={{ maxHeight: "90vh", minHeight: "60vh" }}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl z-10 transition"
          onClick={onClose}
          aria-label="Close CMS"
        >
          &times;
        </button>
        {/* Left: Form */}
        <form
          className="flex-1 p-10 overflow-y-auto bg-gradient-to-br from-blue-50 to-white"
          style={{ minWidth: 0 }}
          onSubmit={e => {
            e.preventDefault();
            onChange({
              ...cmsContent,
              fontFamily,
              fontSize,
              textColor: previewTextColor,
              bgColor: previewBgColor,
            });
            setTimeout(onSave, 0);
          }}
        >
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-base font-semibold">CMS</span>
            <span>Quản lý chi tiết trang: <span className="text-blue-700">{product.product_name}</span></span>
          </h2>
          {/* HERO SECTION */}
          <section className="mb-8">
            <div className="font-semibold mb-3 text-blue-700 text-base uppercase tracking-wide flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full" /> Hero Section
            </div>
            <input
              className="w-full border rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-300"
              value={cmsContent.heroTitle || ""}
              onChange={e => onChange({ ...cmsContent, heroTitle: e.target.value })}
              placeholder="Hero Title"
            />
            <input
              className="w-full border rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-300"
              value={cmsContent.heroSubtitle || ""}
              onChange={e => onChange({ ...cmsContent, heroSubtitle: e.target.value })}
              placeholder="Hero Subtitle"
            />
            <div className="flex items-center gap-3 mt-2">
              {cmsContent.heroImages && cmsContent.heroImages[0] && (
                <img src={cmsContent.heroImages[0]} alt="Hero" className="w-24 h-24 object-cover rounded-lg border shadow" />
              )}
              <button
                type="button"
                className="bg-blue-100 text-blue-700 rounded px-4 py-2 hover:bg-blue-200 font-semibold transition"
                onClick={() => setShowMediaPicker({ field: "heroImages", idx: 0 })}
              >
                {cmsContent.heroImages && cmsContent.heroImages[0] ? "Change" : "Select"} Image
              </button>
              {cmsContent.heroImages && cmsContent.heroImages[0] && (
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 text-xl"
                  onClick={() => {
                    const arr = [...cmsContent.heroImages!];
                    arr[0] = "";
                    onChange({ ...cmsContent, heroImages: arr });
                  }}
                  aria-label="Remove image"
                  title="Remove hero image"
                >
                  &times;
                </button>
              )}
            </div>
          </section>
          {/* ABOUT SECTION */}
          <section className="mb-8">
            <div className="font-semibold mb-3 text-blue-700 text-base uppercase tracking-wide flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full" /> About Section
            </div>
            <input
              className="w-full border rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-300"
              value={cmsContent.aboutTitle || ""}
              onChange={e => onChange({ ...cmsContent, aboutTitle: e.target.value })}
              placeholder="About Title"
            />
            <textarea
              className="w-full border rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-300"
              value={cmsContent.aboutText || ""}
              onChange={e => onChange({ ...cmsContent, aboutText: e.target.value })}
              placeholder="About Text"
              rows={3}
            />
            <div className="flex flex-col gap-2">
              {(cmsContent.aboutImages || []).map((img, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {img && (
                    <img src={img} alt={`About ${idx + 1}`} className="w-16 h-16 object-cover rounded border shadow" />
                  )}
                  <button
                    type="button"
                    className="bg-blue-100 text-blue-700 rounded px-3 py-2 hover:bg-blue-200 font-semibold"
                    onClick={() => setShowMediaPicker({ field: "aboutImages", idx })}
                  >
                    {img ? "Change" : "Select"} Image
                  </button>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 text-lg"
                    onClick={() => removeArrayItem("aboutImages", idx)}
                    aria-label="Remove image"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-semibold w-fit"
                onClick={() => addArrayItem("aboutImages")}
              >
                + Add About Image
              </button>
            </div>
          </section>
          {/* SLIDER SECTION */}
          <section className="mb-8">
            <div className="font-semibold mb-3 text-blue-700 text-base uppercase tracking-wide flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full" /> Slider Section
            </div>
            <div className="flex flex-col gap-2">
              {(cmsContent.sliderImages || []).map((img, idx) => (
                <div key={idx} className="flex items-center gap-2 relative">
                  <span className="absolute -left-6 top-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow">
                    {idx + 1}
                  </span>
                  {img && (
                    <img src={img} alt={`Slider ${idx + 1}`} className="w-16 h-16 object-cover rounded border shadow" />
                  )}
                  <button
                    type="button"
                    className="bg-blue-100 text-blue-700 rounded px-3 py-2 hover:bg-blue-200 font-semibold"
                    onClick={() => setShowMediaPicker({ field: "sliderImages", idx })}
                  >
                    {img ? "Change" : "Select"} Image
                  </button>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 text-lg"
                    onClick={() => removeArrayItem("sliderImages", idx)}
                    aria-label="Remove image"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-semibold w-fit"
                onClick={() => addArrayItem("sliderImages")}
              >
                + Add Slider Image
              </button>
            </div>
          </section>
          {/* DETAILS SECTION */}
          <section className="mb-8">
            <div className="font-semibold mb-3 text-blue-700 text-base uppercase tracking-wide flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full" /> Product Details Section
            </div>
            <input
              className="w-full border rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-300"
              value={cmsContent.detailsTitle || ""}
              onChange={e => onChange({ ...cmsContent, detailsTitle: e.target.value })}
              placeholder="Details Title"
            />
            <textarea
              className="w-full border rounded px-3 py-2 font-mono focus:ring-2 focus:ring-blue-300"
              value={cmsContent.detailsContent || ""}
              onChange={e => onChange({ ...cmsContent, detailsContent: e.target.value })}
              placeholder="Details Content (Markdown supported)"
              rows={6}
            />
          </section>
          {/* TABS SECTION */}
          <section className="mb-8">
            <div className="font-semibold mb-3 text-blue-700 text-base uppercase tracking-wide flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full" /> Product Tabs
            </div>
            {["Specifications", "How To Play", "Contents"].map((fixedTitle, _fixedIdx) => {
              // Find the tab for this fixed title
              const tabIdx = tabs.findIndex(t => t.title.trim().toLowerCase() === fixedTitle.toLowerCase());
              // If not found, create a local fallback (DO NOT push to tabs!)
              const tab = tabIdx >= 0
                ? tabs[tabIdx]
                : { title: fixedTitle, content: "", images: [] };

              return (
                <div key={fixedTitle} className="border rounded-lg p-4 mb-6 bg-white shadow-sm relative group transition hover:shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      className="flex-1 border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300 font-bold"
                      value={tab.title}
                      disabled
                      readOnly
                    />
                  </div>
                  {/* How To Play: only link input */}
                  {fixedTitle === "How To Play" ? (
                    <input
                      className="w-full border rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-300"
                      value={tab.content}
                      onChange={e => {
                        const newTab = { ...tab, content: e.target.value };
                        if (tabIdx >= 0) updateTab(tabIdx, newTab);
                        else onChange({ ...cmsContent, tabs: [...tabs, newTab] });
                      }}
                      placeholder="Paste video link (YouTube, Vimeo, etc.)"
                      type="url"
                      pattern="https?://.+"
                    />
                  ) : (
                    <>
                      <textarea
                        className="w-full border rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-300"
                        value={tab.content}
                        onChange={e => {
                          const newTab = { ...tab, content: e.target.value };
                          if (tabIdx >= 0) updateTab(tabIdx, newTab);
                          else onChange({ ...cmsContent, tabs: [...tabs, newTab] });
                        }}
                        placeholder={`${fixedTitle} Content (Markdown supported)`}
                        rows={4}
                      />
                      <div className="flex flex-col gap-2">
                        {(tab.images || []).map((img, imgIdx) => (
                          <div key={imgIdx} className="flex items-center gap-2">
                            {img && (
                              <img src={img} alt={`Tab ${fixedTitle} Image ${imgIdx + 1}`} className="w-16 h-16 object-cover rounded border shadow" />
                            )}
                            <button
                              type="button"
                              className="bg-blue-100 text-blue-700 rounded px-3 py-2 hover:bg-blue-200 font-semibold"
                              onClick={() => setShowMediaPicker({ field: "tabImages", tabIdx, imgIdx })}
                            >
                              {img ? "Change" : "Select"} Image
                            </button>
                            <button
                              type="button"
                              className="text-red-500 hover:text-red-700 text-lg"
                              onClick={() => removeTabImage(tabIdx, imgIdx)}
                              aria-label="Remove image"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-semibold w-fit"
                          onClick={() => addTabImage(tabIdx)}
                        >
                          + Add Tab Image
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </section>
          {/* FEATURED SECTION (Two Columns Content Blocks) */}
          <section className="mb-8">
            <div className="font-semibold mb-3 text-blue-700 text-base uppercase tracking-wide flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full" /> Featured Section (Two Columns)
              </span>
              <button
                type="button"
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-semibold"
                onClick={() => {
                  const arr = [...(cmsContent.featuredSections || []), {
                    title: "",
                    description: "",
                    imageSrc: "",
                    imageAlt: "",
                    textBgColor: "#fff",
                    isImageRight: false,
                  }];
                  onChange({ ...cmsContent, featuredSections: arr });
                }}
              >
                + Add Block
              </button>
            </div>
            {(cmsContent.featuredSections || []).length === 0 && (
              <div className="text-gray-400 mb-2">No featured blocks yet.</div>
            )}
            {(cmsContent.featuredSections || []).map((block: FeaturedSection, idx: number) => (
              <div key={idx} className="border rounded-lg p-4 mb-6 bg-white shadow-sm relative group transition hover:shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    className="flex-1 border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300"
                    value={block.title}
                    onChange={e => {
                      const arr = [...(cmsContent.featuredSections || [])];
                      arr[idx] = { ...arr[idx], title: e.target.value };
                      onChange({ ...cmsContent, featuredSections: arr });
                    }}
                    placeholder={`Block Title #${idx + 1}`}
                  />
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 text-lg"
                    title="Remove block"
                    onClick={() => {
                      const arr = [...(cmsContent.featuredSections || [])];
                      arr.splice(idx, 1);
                      onChange({ ...cmsContent, featuredSections: arr });
                    }}
                  >
                    &times;
                  </button>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-700 text-lg"
                    disabled={idx === 0}
                    onClick={() => {
                      if (idx === 0) return;
                      const arr = [...(cmsContent.featuredSections || [])];
                      const [moved] = arr.splice(idx, 1);
                      arr.splice(idx - 1, 0, moved);
                      onChange({ ...cmsContent, featuredSections: arr });
                    }}
                    aria-label="Move block up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-700 text-lg"
                    disabled={idx === (cmsContent.featuredSections?.length || 1) - 1}
                    onClick={() => {
                      const arr = [...(cmsContent.featuredSections || [])];
                      if (idx === arr.length - 1) return;
                      const [moved] = arr.splice(idx, 1);
                      arr.splice(idx + 1, 0, moved);
                      onChange({ ...cmsContent, featuredSections: arr });
                    }}
                    aria-label="Move block down"
                  >
                    ↓
                  </button>
                </div>
                <textarea
                  className="w-full border rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-300"
                  value={block.description}
                  onChange={e => {
                    const arr = [...(cmsContent.featuredSections || [])];
                    arr[idx] = { ...arr[idx], description: e.target.value };
                    onChange({ ...cmsContent, featuredSections: arr });
                  }}
                  placeholder="Block Description"
                  rows={3}
                />
                <div className="flex items-center gap-2 mb-2">
                  {block.imageSrc && (
                    <img src={block.imageSrc} alt={block.imageAlt || `Block ${idx + 1}`} className="w-16 h-16 object-cover rounded border shadow" />
                  )}
                  <button
                    type="button"
                    className="bg-blue-100 text-blue-700 rounded px-3 py-2 hover:bg-blue-200 font-semibold"
                    onClick={() => setShowMediaPicker({ field: "featuredSections", idx })}
                  >
                    {block.imageSrc ? "Change" : "Select"} Image
                  </button>
                  <input
                    className="border rounded px-2 py-1 focus:ring-2 focus:ring-blue-300"
                    value={block.imageAlt || ""}
                    onChange={e => {
                      const arr = [...(cmsContent.featuredSections || [])];
                      arr[idx] = { ...arr[idx], imageAlt: e.target.value };
                      onChange({ ...cmsContent, featuredSections: arr });
                    }}
                    placeholder="Image Alt"
                  />
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <label className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Background</span>
                    <input
                      type="color"
                      value={block.textBgColor || "#fff"}
                      onChange={e => {
                        const arr = [...(cmsContent.featuredSections || [])];
                        arr[idx] = { ...arr[idx], textBgColor: e.target.value };
                        onChange({ ...cmsContent, featuredSections: arr });
                      }}
                    />
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={block.isImageRight || false}
                      onChange={e => {
                        const arr = [...(cmsContent.featuredSections || [])];
                        arr[idx] = { ...arr[idx], isImageRight: e.target.checked };
                        onChange({ ...cmsContent, featuredSections: arr });
                      }}
                    />
                    <span className="text-xs text-gray-500">Image Right</span>
                  </label>
                </div>
              </div>
            ))}
          </section>
          {/* Preview Customization */}
          <section className="mt-10">
            <div className="font-semibold mb-3 text-blue-700 text-base uppercase tracking-wide flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full" /> Preview Customization
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label>
                <span className="block text-xs text-gray-500 mb-1">Font Family</span>
                <select
                  value={fontFamily}
                  onChange={e => setFontFamily(e.target.value)}
                  className="border rounded p-1 w-full focus:ring-2 focus:ring-blue-300"
                  onBlur={handlePreviewChange}
                >
                  {FONT_FAMILIES.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="block text-xs text-gray-500 mb-1">Font Size</span>
                <select
                  value={fontSize}
                  onChange={e => setFontSize(e.target.value)}
                  className="border rounded p-1 w-full focus:ring-2 focus:ring-blue-300"
                  onBlur={handlePreviewChange}
                >
                  {FONT_SIZES.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="block text-xs text-gray-500 mb-1">Preview Text Color</span>
                <div className="flex gap-1 flex-wrap w-full">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`w-6 h-6 rounded-full border-2 ${previewTextColor === color ? 'border-blue-500 ring-2 ring-blue-300' : 'border-white'} hover:border-gray-400 transition`}
                      style={{ background: color }}
                      onClick={() => { setPreviewTextColor(color); handlePreviewChange(); }}
                      title={color}
                    />
                  ))}
                </div>
              </label>
              <label>
                <span className="block text-xs text-gray-500 mb-1">Preview Background Color</span>
                <div className="flex gap-1 flex-wrap w-full">
                  {BG_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`w-6 h-6 rounded-full border-2 ${previewBgColor === color ? 'border-blue-500 ring-2 ring-blue-300' : 'border-white'} hover:border-gray-400 transition`}
                      style={{ background: color }}
                      onClick={() => { setPreviewBgColor(color); handlePreviewChange(); }}
                      title={color}
                    />
                  ))}
                </div>
              </label>
            </div>
          </section>
          <div className="flex justify-end gap-3 mt-10">
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
        {/* Right: Live Preview Sidebar */}
        <ProductCmsSidebar
          cmsContent={cmsContent}
          product={product}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          fontSize={fontSize}
          setFontSize={setFontSize}
          previewTextColor={previewTextColor}
          setPreviewTextColor={setPreviewTextColor}
          previewBgColor={previewBgColor}
          setPreviewBgColor={setPreviewBgColor}
          FONT_FAMILIES={FONT_FAMILIES}
          FONT_SIZES={FONT_SIZES}
          COLORS={COLORS}
          BG_COLORS={BG_COLORS}
        />
        {/* MediaPicker Modal */}
        <MediaPicker
          show={!!showMediaPicker}
          multiple={false}
          onSelect={img => {
            if (showMediaPicker) {
              if (showMediaPicker.field === "heroImages" && typeof showMediaPicker.idx === "number") {
                const arr = [...(cmsContent.heroImages || [])];
                arr[showMediaPicker.idx] = Array.isArray(img) ? img[0]?.url ?? "" : img.url;
                onChange({ ...cmsContent, heroImages: arr });
              } else if (
                showMediaPicker.field === "tabImages" &&
                showMediaPicker.tabIdx !== undefined &&
                showMediaPicker.imgIdx !== undefined
              ) {
                // Save the selected image to the correct tab image slot
                const tabIdx = showMediaPicker.tabIdx;
                const imgIdx = showMediaPicker.imgIdx;
                const url = Array.isArray(img) ? img[0]?.url ?? "" : img.url;
                const tab = { ...tabs[tabIdx] };
                const images = [...(tab.images || [])];
                images[imgIdx] = url;
                tab.images = images;
                updateTab(tabIdx, tab);
              } else if (showMediaPicker.field === "featuredSections" && typeof showMediaPicker.idx === "number") {
                const arr = [...(cmsContent.featuredSections || [])];
                arr[showMediaPicker.idx] = { ...arr[showMediaPicker.idx], imageSrc: Array.isArray(img) ? img[0]?.url ?? "" : img.url };
                onChange({ ...cmsContent, featuredSections: arr });
              } else if (
                showMediaPicker.field &&
                typeof showMediaPicker.idx === "number" &&
                ["aboutImages", "sliderImages"].includes(showMediaPicker.field)
              ) {
                const arr = [...(cmsContent[showMediaPicker.field as keyof CmsContent] as string[] || [])];
                arr[showMediaPicker.idx] = Array.isArray(img) ? img[0]?.url ?? "" : img.url;
                onChange({ ...cmsContent, [showMediaPicker.field]: arr });
              }
              setShowMediaPicker(null);
            }
          }}
          onClose={() => setShowMediaPicker(null)}
        />
      </div>
    </div>
  );
};

export default ProductCmsModal;