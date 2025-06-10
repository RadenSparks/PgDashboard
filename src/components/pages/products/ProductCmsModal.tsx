/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import type { Product, CmsContent } from "./types";
import { Button } from "../../widgets/button";
import ReactMarkdown from "react-markdown";

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
    const modalRef = useRef<HTMLDivElement>(null);
    const [showPreview, setShowPreview] = useState(false);

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

    // --- Tag and category info for CMS preview ---
    // Group tags by type for display
    const genreTags = product.tags?.filter(t =>
        // Only show genre tags (multi)
        ["Strategy", "Party", "Cooperative"].includes(t)
    ) || [];
    const playerTag = product.tags?.find(t =>
        ["2-4", "4-10", "1-5"].includes(t)
    ) || "";
    const durationTag = product.tags?.find(t =>
        ["Short", "Average", "Long"].includes(t)
    ) || "";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-y-auto">
            <div
                ref={modalRef}
                className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-8 relative my-12"
                style={{ maxHeight: "90vh", overflowY: "auto" }}
            >
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
                    onClick={onClose}
                    aria-label="Close CMS"
                >
                    &times;
                </button>
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-bold mb-2">
                        Manage Details Page for: <span className="text-blue-700">{product.name}</span>
                    </h2>
                    <Button
                        className="bg-gray-100 text-blue-700 border border-blue-200 hover:bg-blue-200 px-4 py-1 rounded text-sm"
                        type="button"
                        onClick={() => setShowPreview((v) => !v)}
                    >
                        {showPreview ? "Hide Full Preview" : "Full Page Preview"}
                    </Button>
                </div>
                {!showPreview ? (
                    <form className="space-y-8" onSubmit={e => { e.preventDefault(); onSave(); }}>
                        {/* Hero Section */}
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
                                <div>
                                    <span className="block text-xs font-medium text-gray-600 mb-1">Preview</span>
                                    <div className="prose prose-sm max-w-none border rounded p-3 bg-gray-50 min-h-[60px]">
                                        <ReactMarkdown
                                            components={{
                                                img: ({node, ...props}) => (
                                                    <img
                                                        {...props}
                                                        className="rounded shadow max-w-xs my-2 mx-auto"
                                                        style={{ display: "block" }}
                                                    />
                                                ),
                                                h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
                                                h2: ({node, ...props}) => <h2 className="text-xl font-semibold mt-3 mb-2" {...props} />,
                                                h3: ({node, ...props}) => <h3 className="text-lg font-semibold mt-2 mb-1" {...props} />,
                                                ul: ({node, ...props}) => <ul className="list-disc ml-6" {...props} />,
                                                ol: ({node, ...props}) => <ol className="list-decimal ml-6" {...props} />,
                                                a: ({node, ...props}) => <a className="text-blue-600 underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                                code: ({node, ...props}) => <code className="bg-gray-200 px-1 rounded text-xs" {...props} />,
                                                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-300 pl-4 italic text-gray-600" {...props} />,
                                            }}
                                        >
                                            {cmsContent.detailsContent || "*Nothing to preview*"}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <div className="flex justify-end gap-2">
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
                ) : (
                    <div className="bg-gray-50 rounded-lg p-6 overflow-y-auto" style={{ maxHeight: "70vh" }}>
                        <h1 className="text-3xl font-bold mb-2">{cmsContent.heroTitle}</h1>
                        <h2 className="text-xl text-gray-600 mb-4">{cmsContent.heroSubtitle}</h2>
                        <div className="flex gap-2 mb-6 flex-wrap">
                            {(cmsContent.heroImages || []).map((img, idx) =>
                                img ? (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Hero ${idx + 1}`}
                                        className="w-32 h-32 object-cover rounded border"
                                    />
                                ) : null
                            )}
                        </div>
                        {/* --- Show product meta info --- */}
                        <div className="mb-2">
                            <span className="font-semibold">Category:</span> {product.category}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Genres:</span>{" "}
                            {genreTags.length > 0 ? (
                                <span>
                                    {genreTags.map((tag, idx) => (
                                        <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs mx-1">{tag}</span>
                                    ))}
                                </span>
                            ) : (
                                <span className="text-gray-400">-</span>
                            )}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Players:</span>{" "}
                            {playerTag ? (
                                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">{playerTag}</span>
                            ) : (
                                <span className="text-gray-400">-</span>
                            )}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Duration:</span>{" "}
                            {durationTag ? (
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">{durationTag}</span>
                            ) : (
                                <span className="text-gray-400">-</span>
                            )}
                        </div>
                        {/* --- End product meta info --- */}
                        <h3 className="text-2xl font-semibold mb-2">{cmsContent.aboutTitle}</h3>
                        <p className="mb-4">{cmsContent.aboutText}</p>
                        <div className="flex gap-2 mb-6 flex-wrap">
                            {(cmsContent.aboutImages || []).map((img, idx) =>
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
                        {(cmsContent.sliderImages && cmsContent.sliderImages.length > 0) && (
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold mb-2">Slider</h4>
                                <div className="flex gap-2 flex-wrap">
                                    {cmsContent.sliderImages.map((img, idx) =>
                                        img ? (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt={`Slider ${idx + 1}`}
                                                className="w-20 h-20 object-cover rounded border"
                                            />
                                        ) : null
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="mb-4">
                            <h4 className="text-lg font-semibold mb-2">{cmsContent.detailsTitle}</h4>
                            <div className="prose prose-sm max-w-none border rounded p-3 bg-white min-h-[60px]">
                                <ReactMarkdown
                                    components={{
                                        img: ({node, ...props}) => (
                                            <img
                                                {...props}
                                                className="rounded shadow max-w-xs my-2 mx-auto"
                                                style={{ display: "block" }}
                                            />
                                        ),
                                        h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
                                        h2: ({node, ...props}) => <h2 className="text-xl font-semibold mt-3 mb-2" {...props} />,
                                        h3: ({node, ...props}) => <h3 className="text-lg font-semibold mt-2 mb-1" {...props} />,
                                        ul: ({node, ...props}) => <ul className="list-disc ml-6" {...props} />,
                                        ol: ({node, ...props}) => <ol className="list-decimal ml-6" {...props} />,
                                        a: ({node, ...props}) => <a className="text-blue-600 underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                        code: ({node, ...props}) => <code className="bg-gray-200 px-1 rounded text-xs" {...props} />,
                                        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-300 pl-4 italic text-gray-600" {...props} />,
                                    }}
                                >
                                    {cmsContent.detailsContent || "*Nothing to preview*"}
                                </ReactMarkdown>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                className="bg-gray-200 px-6 py-2 rounded"
                                type="button"
                                onClick={() => setShowPreview(false)}
                            >
                                Back to Edit
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCmsModal;