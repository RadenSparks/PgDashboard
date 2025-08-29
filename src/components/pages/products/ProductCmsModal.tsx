import { useState } from "react";
import ProductCmsSidebar from "./ProductCmsSidebar";
import MediaPicker from "../../media/MediaPicker";
import type { Product, CmsContent, TabSection, FeaturedSection } from "./types";
import { Button } from "../../widgets/button";

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
    // Always ensure images is an array
    newTabs[idx] = { ...tab, images: Array.isArray(tab.images) ? tab.images : [] };
    onChange({ ...cmsContent, tabs: newTabs });
  };

  // Tab image helpers
  const addTabImage = (tabIdx: number) => {
    const tab = { ...tabs[tabIdx] };
    // Ensure images is always an array
    tab.images = Array.isArray(tab.images) ? [...tab.images, ""] : [""];
    updateTab(tabIdx, tab);
    setShowMediaPicker({ field: "tabImages", tabIdx, imgIdx: tab.images.length - 1 });
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

  // Update tab names
  const TAB_TITLES = ["Nội dung", "Cách chơi", "Tham Khảo"];

  // Reference tab helpers
  const updateReferenceTab = (references: { title: string; link: string }[]) => {
    const tabIdx = tabs.findIndex(
      t => t.title.trim().toLowerCase() === "tham khảo"
        || t.title.trim().toLowerCase() === "reference"
        || t.title.trim().toLowerCase() === "tài liệu tham khảo"
    );
    const newTab: TabSection = { title: "Tham Khảo", content: "", images: [], references };
    if (tabIdx >= 0) updateTab(tabIdx, newTab);
    else onChange({ ...cmsContent, tabs: [...tabs, newTab] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-y-auto">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-[90vw] w-[90vw] min-h-[80vh] p-0 relative my-12 flex flex-col md:flex-row overflow-hidden"
        style={{ maxHeight: "95vh", minHeight: "80vh" }}
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
          {/* SLIDER SECTION */}
          <section className="mb-8">
            <div className="font-semibold mb-3 text-blue-700 text-base uppercase tracking-wide flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full" /> Phần trình chiếu ảnh
            </div>
            <div className="flex flex-col gap-2">
              {(cmsContent.sliderImages || []).map((img, idx) => (
                <div key={idx} className="flex items-center gap-2 relative">
                  <span className="absolute -left-6 top-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow">
                    {idx + 1}
                  </span>
                  {img && (
                    <img src={img} alt={`Trình chiếu ${idx + 1}`} className="w-20 h-20 object-cover rounded border shadow" />
                  )}
                  <button
                    type="button"
                    className="bg-blue-100 text-blue-700 rounded px-4 py-2 hover:bg-blue-200 font-semibold"
                    onClick={() => setShowMediaPicker({ field: "sliderImages", idx })}
                  >
                    {img ? "Đổi" : "Chọn"} ảnh
                  </button>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 text-lg"
                    onClick={() => removeArrayItem("sliderImages", idx)}
                    aria-label="Xóa ảnh"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-base font-semibold w-fit"
                onClick={() => addArrayItem("sliderImages")}
              >
                + Thêm ảnh trình chiếu
              </button>
            </div>
          </section>
          {/* DETAILS SECTION */}
          <section className="mb-8">
            <div className="font-semibold mb-3 text-blue-700 text-base uppercase tracking-wide flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full" /> Phần chi tiết sản phẩm
            </div>
            <input
              className="w-full border rounded px-4 py-3 mb-2 text-lg focus:ring-2 focus:ring-blue-300"
              value={cmsContent.detailsTitle || ""}
              onChange={e => onChange({ ...cmsContent, detailsTitle: e.target.value })}
              placeholder="Tiêu đề chi tiết"
            />
            <textarea
              className="w-full border rounded px-4 py-3 font-mono text-lg focus:ring-2 focus:ring-blue-300"
              value={cmsContent.detailsContent || ""}
              onChange={e => onChange({ ...cmsContent, detailsContent: e.target.value })}
              placeholder="Nội dung chi tiết (hỗ trợ Markdown)"
              rows={8}
            />
          </section>
          {/* TABS SECTION */}
          <section className="mb-8">
            <div className="font-semibold mb-3 text-blue-700 text-base uppercase tracking-wide flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full" /> Thông tin sản phẩm
            </div>
            {TAB_TITLES.map((fixedTitle) => {
              const tabIdx = tabs.findIndex(
                t => t.title.trim().toLowerCase() === fixedTitle.toLowerCase() ||
                  (fixedTitle === "Tham Khảo" &&
                    (t.title.trim().toLowerCase() === "reference" ||
                     t.title.trim().toLowerCase() === "tài liệu tham khảo"))
              );
              const tab: TabSection = tabIdx >= 0
                ? tabs[tabIdx]
                : fixedTitle === "Tham Khảo"
                  ? { title: "Tham Khảo", content: "", images: [], references: [] }
                  : { title: fixedTitle, content: "", images: [] };

              return (
                <div key={fixedTitle} className="border rounded-lg p-6 mb-8 bg-white shadow-sm relative group transition hover:shadow-lg">
                  <div className="flex items-center gap-2 mb-4 sticky top-0 bg-white z-10 py-2 rounded-t-lg">
                    <input
                      className="flex-1 border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300 font-bold bg-gray-50"
                      value={tab.title}
                      disabled
                      readOnly
                    />
                  </div>
                  {/* How To Play: only video link input */}
                  {fixedTitle === "Cách chơi" ? (
                    <>
                      <input
                        className="w-full border rounded px-4 py-3 mb-2 focus:ring-2 focus:ring-blue-300"
                        value={tab.content}
                        onChange={e => {
                          const newTab: TabSection = { ...tab, content: e.target.value, images: tab.images || [] };
                          if (tabIdx >= 0) updateTab(tabIdx, newTab);
                          else onChange({ ...cmsContent, tabs: [...tabs, newTab] });
                        }}
                        placeholder="Dán link video (YouTube, Vimeo, ...)"
                        type="url"
                        pattern="https?://.+"
                      />
                      {tab.content && (
                        <>
                          <a
                            href={tab.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline break-all"
                          >
                            {tab.content}
                          </a>
                          {getYouTubeEmbedUrl(tab.content) && (
                            <div className="mt-2">
                              <iframe
                                width="420"
                                height="236"
                                src={getYouTubeEmbedUrl(tab.content) as string}
                                title="Video hướng dẫn chơi"
                                frameBorder={0}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          )}
                        </>
                      )}
                    </>
                  ) : fixedTitle === "Tham Khảo" ? (
                    <>
                      <div className="flex flex-col gap-2">
                        {(tab.references || []).map((ref: { title: string; link: string }, refIdx: number) => (
                          <div key={refIdx} className="flex gap-2 items-center">
                            <input
                              className="border rounded px-2 py-1 flex-1"
                              value={ref.title}
                              onChange={e => {
                                const refs = [...(tab.references || [])];
                                refs[refIdx] = { ...refs[refIdx], title: e.target.value };
                                updateReferenceTab(refs);
                              }}
                              placeholder="Tiêu đề tài liệu"
                            />
                            <input
                              className="border rounded px-2 py-1 flex-1"
                              value={ref.link}
                              onChange={e => {
                                const refs = [...(tab.references || [])];
                                refs[refIdx] = { ...refs[refIdx], link: e.target.value };
                                updateReferenceTab(refs);
                              }}
                              placeholder="Link tài liệu (https://...)"
                              type="url"
                              pattern="https?://.+"
                            />
                            <button
                              type="button"
                              className="text-red-500 hover:text-red-700 px-2 py-1 rounded"
                              onClick={() => {
                                const refs = [...(tab.references || [])];
                                refs.splice(refIdx, 1);
                                updateReferenceTab(refs);
                              }}
                              aria-label="Xóa tài liệu"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-semibold w-fit"
                          onClick={() => updateReferenceTab([...(tab.references || []), { title: "", link: "" }])}
                        >
                          + Thêm tài liệu
                        </button>
                      </div>
                    </>
                  ) : (
                    // Specifications tab (markdown + images)
                    <>
                      <textarea
                        className="w-full border rounded px-4 py-3 mb-2 focus:ring-2 focus:ring-blue-300"
                        value={tab.content}
                        onChange={e => {
                          const newTab = { ...tab, content: e.target.value, images: tab.images || [] };
                          if (tabIdx >= 0) updateTab(tabIdx, newTab);
                          else onChange({ ...cmsContent, tabs: [...tabs, newTab] });
                        }}
                        placeholder={`Nội dung ${fixedTitle} (hỗ trợ Markdown)`}
                        rows={4}
                      />
                      <div className="flex flex-col gap-2">
                        {(tab.images || []).map((img, imgIdx) => (
                          <div key={imgIdx} className="flex items-center gap-2">
                            {img && (
                              <img src={img} alt={`Tab ${fixedTitle} Ảnh ${imgIdx + 1}`} className="w-20 h-20 object-cover rounded border shadow" />
                            )}
                            <button
                              type="button"
                              className="bg-blue-100 text-blue-700 rounded px-4 py-2 hover:bg-blue-200 font-semibold"
                              onClick={() => setShowMediaPicker({ field: "tabImages", tabIdx, imgIdx })}
                            >
                              {img ? "Đổi" : "Chọn"} ảnh
                            </button>
                            <button
                              type="button"
                              className="text-red-500 hover:text-red-700 text-lg"
                              onClick={() => removeTabImage(tabIdx, imgIdx)}
                              aria-label="Xóa ảnh"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-base font-semibold w-fit"
                          onClick={() => addTabImage(tabIdx)}
                        >
                          + Thêm ảnh
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
                    className="flex-1 border rounded px-4 py-3 focus:ring-2 focus:ring-blue-300"
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
                  className="w-full border rounded px-4 py-3 mb-2 focus:ring-2 focus:ring-blue-300"
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
                    className="bg-blue-100 text-blue-700 rounded px-4 py-2 hover:bg-blue-200 font-semibold"
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
          {/* ABOUT SECTION */}
          <section className="mb-8">
            <div className="font-semibold mb-3 text-blue-700 text-base uppercase tracking-wide flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full" /> Ảnh giới thiệu sản phẩm
            </div>
            <div className="flex flex-col gap-2 mt-2">
              {(cmsContent.aboutImages || []).map((img, idx) => (
                <div key={idx} className="flex items-center gap-2 relative">
                  <span className="absolute -left-6 top-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow">
                    {idx + 1}
                  </span>
                  {img && (
                    <img src={img} alt={`Giới thiệu ${idx + 1}`} className="w-20 h-20 object-cover rounded border shadow" />
                  )}
                  <button
                    type="button"
                    className="bg-blue-100 text-blue-700 rounded px-4 py-2 hover:bg-blue-200 font-semibold"
                    onClick={() => setShowMediaPicker({ field: "aboutImages", idx })}
                  >
                    {img ? "Đổi" : "Chọn"} ảnh
                  </button>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 text-lg"
                    onClick={() => removeArrayItem("aboutImages", idx)}
                    aria-label="Xóa ảnh"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-base font-semibold w-fit"
                onClick={() => addArrayItem("aboutImages")}
              >
                + Thêm ảnh giới thiệu
              </button>
            </div>
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
              Lưu
            </Button>
            <Button
              className="bg-gray-200 px-8 py-2 rounded-lg font-semibold text-base"
              type="button"
              onClick={onClose}
            >
              Hủy
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
              // --- Remove heroImages logic ---
              // Only handle tabImages, featuredSections, sliderImages
              if (
                showMediaPicker.field === "tabImages" &&
                showMediaPicker.tabIdx !== undefined &&
                showMediaPicker.imgIdx !== undefined
              ) {
                const tabs = [...(cmsContent.tabs || [])];
                const tab = tabs[showMediaPicker.tabIdx];
                if (tab) {
                  const images = [...(tab.images || [])];
                  images[showMediaPicker.imgIdx] = Array.isArray(img) ? img[0]?.url ?? "" : img.url;
                  tab.images = images;
                  tabs[showMediaPicker.tabIdx] = tab;
                  onChange({ ...cmsContent, tabs });
                }
              } else if (
                showMediaPicker.field === "featuredSections" &&
                typeof showMediaPicker.idx === "number"
              ) {
                const arr = [...(cmsContent.featuredSections || [])];
                arr[showMediaPicker.idx].imageSrc = Array.isArray(img) ? img[0]?.url ?? "" : img.url;
                onChange({ ...cmsContent, featuredSections: arr });
              } else if (
                showMediaPicker.field === "sliderImages" &&
                typeof showMediaPicker.idx === "number"
              ) {
                const arr = [...(cmsContent.sliderImages || [])];
                arr[showMediaPicker.idx] = Array.isArray(img) ? img[0]?.url ?? "" : img.url;
                onChange({ ...cmsContent, sliderImages: arr });
              } else if (
                showMediaPicker.field === "aboutImages" &&
                typeof showMediaPicker.idx === "number"
              ) {
                const arr = [...(cmsContent.aboutImages || [])];
                arr[showMediaPicker.idx] = Array.isArray(img) ? img[0]?.url ?? "" : img.url;
                onChange({ ...cmsContent, aboutImages: arr });
              }
            }
          }}
          onClose={() => setShowMediaPicker(null)}
        />
      </div>
    </div>
  );
};

function getYouTubeEmbedUrl(url: string): string | null {
  // Match standard YouTube URL
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (!match) return null;
  const videoId = match[1];
  // Extract start time if present
  const timeMatch = url.match(/[?&]t=(\d+)s?/);
  const start = timeMatch ? `?start=${timeMatch[1]}` : "";
  return `https://www.youtube.com/embed/${videoId}${start}`;
}

export default ProductCmsModal;