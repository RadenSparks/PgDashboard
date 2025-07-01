/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import type { Product, CmsContent } from "./types";
import { Button } from "../../widgets/button";
import ProductCmsSidebar from "./ProductCmsSidebar";

type ProductCmsModalProps = {
    product: Product;
    cmsContent: CmsContent;
    onChange: (content: CmsContent) => void;
    onSave: () => void;
    onClose: () => void;
};

const FONT_FAMILIES = [
  { label: 'Sans', value: 'sans-serif' },
  { label: 'Serif', value: 'serif' },
  { label: 'Mono', value: 'monospace' },
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
];

const FONT_SIZES = [
  { label: 'Small', value: 'text-base' },
  { label: 'Medium', value: 'text-lg' },
  { label: 'Large', value: 'text-2xl' },
];

const COLORS = [
  '#000000', '#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa', '#ffffff',
];

const BG_COLORS = [
  '#ffffff', '#f8fafc', '#f1f5f9', '#e3f2fd', '#fffde7', '#fce4ec', '#f3e5f5', '#e8f5e9',
];

const ProductCmsModal = ({
    product,
    cmsContent,
    onChange,
    onSave,
    onClose,
}: ProductCmsModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Customization state for preview
    const [fontFamily, setFontFamily] = useState('sans-serif');
    const [fontSize, setFontSize] = useState('text-lg');
    const [previewTextColor, setPreviewTextColor] = useState('#000000');
    const [previewBgColor, setPreviewBgColor] = useState('#ffffff');

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [onClose]);

    // Helper for updating array fields
    const updateArray = (field: keyof CmsContent, idx: number, value: string) => {
        const arr = [...(cmsContent[field] as string[] || [])];
        arr[idx] = value;
        onChange({ ...cmsContent, [field]: arr });
    };

    const removeArrayItem = (field: keyof CmsContent, idx: number) => {
        const arr = [...(cmsContent[field] as string[] || [])];
        arr.splice(idx, 1);
        onChange({ ...cmsContent, [field]: arr });
    };

    const addArrayItem = (field: keyof CmsContent) => {
        const arr = [...(cmsContent[field] as string[] || []), ""];
        onChange({ ...cmsContent, [field]: arr });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-y-auto">
            <div
                ref={modalRef}
                className="bg-white rounded-xl shadow-lg max-w-5xl w-full p-0 relative my-12 flex flex-col md:flex-row overflow-hidden"
                style={{ maxHeight: "90vh", minHeight: "60vh" }}
            >
                {/* Close Button */}
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl z-10"
                    onClick={onClose}
                    aria-label="Close CMS"
                >
                    &times;
                </button>
                {/* Left: Form */}
                <form
                    className="flex-1 p-8 overflow-y-auto"
                    style={{ minWidth: 0 }}
                    onSubmit={e => { e.preventDefault(); onSave(); }}
                >
                    <h2 className="text-xl font-bold mb-6">
                        Manage Details Page for: <span className="text-blue-700">{product.name}</span>
                    </h2>
                    {/* --- Form fields, same as before, but no preview here --- */}
                    {/* ... (copy your form fields here, unchanged) ... */}
                    {/* Example: */}
                    <section>
                        <div className="font-semibold mb-2 text-blue-700 text-sm uppercase tracking-wide">Hero Section</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label>
                                <span className="block text-xs font-medium text-gray-600 mb-1">Hero Title</span>
                                <input
                                    className="w-full border rounded px-3 py-2"
                                    value={cmsContent.heroTitle}
                                    onChange={e => onChange({ ...cmsContent, heroTitle: e.target.value })}
                                    placeholder="Hero Title"
                                />
                            </label>
                            <label>
                                <span className="block text-xs font-medium text-gray-600 mb-1">Hero Subtitle</span>
                                <input
                                    className="w-full border rounded px-3 py-2"
                                    value={cmsContent.heroSubtitle}
                                    onChange={e => onChange({ ...cmsContent, heroSubtitle: e.target.value })}
                                    placeholder="Hero Subtitle"
                                />
                            </label>
                        </div>
                        {/* Hero Images Section */}
                        <div className="mt-3">
                            <span className="block text-xs font-medium text-gray-600 mb-1">Hero Images</span>
                            <div className="flex flex-col gap-2">
                                {(cmsContent.heroImages as string[]).map((img, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <input
                                            className="w-full border rounded px-3 py-2"
                                            type="text"
                                            value={img}
                                            placeholder={`Hero Image #${idx + 1}`}
                                            onChange={e => updateArray("heroImages", idx, e.target.value)}
                                        />
                                        <select
                                            className="border rounded px-2 py-1 text-xs"
                                            value=""
                                            onChange={e => {
                                                if (!e.target.value) return;
                                                updateArray("heroImages", idx, e.target.value);
                                            }}
                                        >
                                            <option value="">Use gallery image...</option>
                                            {product.images.map((galleryImg, gIdx) => (
                                                <option value={galleryImg.url} key={gIdx}>
                                                    {galleryImg.name ? galleryImg.name : `Gallery #${gIdx + 1}`}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            className="text-red-500 hover:text-red-700 text-lg"
                                            onClick={() => removeArrayItem("heroImages", idx)}
                                            aria-label="Remove image"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-semibold w-fit"
                                    onClick={() => addArrayItem("heroImages")}
                                >
                                    + Add Hero Image
                                </button>
                            </div>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {(cmsContent.heroImages as string[]).map((img, idx) =>
                                    img ? (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`Hero ${idx + 1}`}
                                            className="w-16 h-16 object-cover rounded border"
                                        />
                                    ) : null
                                )}
                            </div>
                        </div>
                    </section>
                    {/* About Section */}
                    <section>
                        <div className="font-semibold mb-2 text-blue-700 text-sm uppercase tracking-wide">About Section</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label>
                                <span className="block text-xs font-medium text-gray-600 mb-1">About Title</span>
                                <input
                                    className="w-full border rounded px-3 py-2"
                                    value={cmsContent.aboutTitle}
                                    onChange={e => onChange({ ...cmsContent, aboutTitle: e.target.value })}
                                    placeholder="About Title"
                                />
                            </label>
                            <label>
                                <span className="block text-xs font-medium text-gray-600 mb-1">About Text</span>
                                <textarea
                                    className="w-full border rounded px-3 py-2"
                                    value={cmsContent.aboutText}
                                    onChange={e => onChange({ ...cmsContent, aboutText: e.target.value })}
                                    placeholder="About Text"
                                    rows={3}
                                />
                            </label>
                        </div>
                        {/* About Images Section */}
                        <div className="mt-3">
                            <span className="block text-xs font-medium text-gray-600 mb-1">About Images</span>
                            <div className="flex flex-col gap-2">
                                {(cmsContent.aboutImages as string[]).map((img, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <input
                                            className="w-full border rounded px-3 py-2"
                                            type="text"
                                            value={img}
                                            placeholder={`About Image #${idx + 1}`}
                                            onChange={e => updateArray("aboutImages", idx, e.target.value)}
                                        />
                                        <select
                                            className="border rounded px-2 py-1 text-xs"
                                            value=""
                                            onChange={e => {
                                                if (!e.target.value) return;
                                                updateArray("aboutImages", idx, e.target.value);
                                            }}
                                        >
                                            <option value="">Use gallery image...</option>
                                            {product.images.map((galleryImg, gIdx) => (
                                                <option value={galleryImg.url} key={gIdx}>
                                                    {galleryImg.name ? galleryImg.name : `Gallery #${gIdx + 1}`}
                                                </option>
                                            ))}
                                        </select>
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
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {(cmsContent.aboutImages as string[]).map((img, idx) =>
                                    img ? (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`About ${idx + 1}`}
                                            className="w-24 h-24 object-cover rounded border"
                                        />
                                    ) : null
                                )}
                            </div>
                        </div>
                    </section>
                    {/* Slider Section */}
                    <section>
                        <div className="font-semibold mb-2 text-blue-700 text-sm uppercase tracking-wide">Slider Section</div>
                        <div className="flex flex-col gap-2">
                            {(cmsContent.sliderImages as string[] || []).map((img, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input
                                        className="w-full border rounded px-3 py-2"
                                        type="text"
                                        value={img}
                                        placeholder={`Slider Image #${idx + 1}`}
                                        onChange={e => updateArray("sliderImages", idx, e.target.value)}
                                    />
                                    <select
                                        className="border rounded px-2 py-1 text-xs"
                                        value=""
                                        onChange={e => {
                                            if (!e.target.value) return;
                                            updateArray("sliderImages", idx, e.target.value);
                                        }}
                                    >
                                        <option value="">Use gallery image...</option>
                                        {product.images.map((galleryImg, gIdx) => (
                                            <option value={galleryImg.url} key={gIdx}>
                                                {galleryImg.name ? galleryImg.name : `Gallery #${gIdx + 1}`}
                                            </option>
                                        ))}
                                    </select>
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
                        <div className="flex gap-2 mt-2 flex-wrap">
                            {(cmsContent.sliderImages as string[] || []).map((img, idx) =>
                                img ? (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Slider ${idx + 1}`}
                                        className="w-16 h-16 object-cover rounded border"
                                    />
                                ) : null
                            )}
                        </div>
                    </section>
                    {/* Product Details Section */}
                    <section>
                        <div className="font-semibold mb-2 text-blue-700 text-sm uppercase tracking-wide">Product Details Section</div>
                        <div className="grid grid-cols-1 gap-3">
                            <label>
                                <span className="block text-xs font-medium text-gray-600 mb-1">Details Title</span>
                                <input
                                    className="w-full border rounded px-3 py-2"
                                    value={cmsContent.detailsTitle || ""}
                                    onChange={e => onChange({ ...cmsContent, detailsTitle: e.target.value })}
                                    placeholder="Details Title"
                                />
                            </label>
                            <label>
                                <span className="block text-xs font-medium text-gray-600 mb-1">Details Content (Markdown Supported)</span>
                                <textarea
                                    className="w-full border rounded px-3 py-2 font-mono"
                                    value={cmsContent.detailsContent || ""}
                                    onChange={e => onChange({ ...cmsContent, detailsContent: e.target.value })}
                                    placeholder="Details Content (Markdown supported)"
                                    rows={6}
                                />
                            </label>
                        </div>
                    </section>
                    <div className="flex justify-end gap-2 mt-8">
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
                {/* Right: Sidebar Preview & Customization */}
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
            </div>
        </div>
    );
};

export default ProductCmsModal;