import React, { useState, useEffect, useRef } from 'react';
import { useCreatePostMutation, useUpdatePostMutation, type Post, useGetPostsByCatalogueQuery } from '../../../redux/postsApi';
import api from '../../../api/axios-client';
import PostFormToolbar from './PostFormToolbar';
import PostFormSidebar from './PostFormSidebar';
import MediaPicker from "../../media/MediaPicker";
import { useToast } from '@chakra-ui/react';

// --- Add these interfaces for type safety ---
interface Catalogue {
  id: number;
  name: string;
}

interface PostFormType {
  id?: number;
  name?: string;
  canonical?: string;
  catalogueId?: number | string;
  catalogue?: { id?: number; name?: string };
  order?: number;
  description?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keyword?: string;
  image?: string;
  content?: string;
  created_at?: string;
  publish?: boolean;
  galleryImages?: string[];
  [key: string]: unknown;
}
// --------------------------------------------

interface Props {
  initialData?: Partial<Post>;
  onSuccess?: () => void;
}

const FONT_FAMILIES = [
  { label: 'Sans', value: 'sans-serif' },
  { label: 'Serif', value: 'serif' },
  { label: 'Mono', value: 'monospace' },
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
];

const FONT_SIZES = [
  { label: 'Nhỏ', value: 'text-base' },
  { label: 'Vừa', value: 'text-lg' },
  { label: 'Lớn', value: 'text-2xl' },
];

const COLORS = [
  '#000000', '#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa', '#ffffff',
];

const BG_COLORS = [
  '#ffffff', '#f8fafc', '#f1f5f9', '#e3f2fd', '#fffde7', '#fce4ec', '#f3e5f5', '#e8f5e9',
];

const PostForm: React.FC<Props> = ({ initialData = {}, onSuccess }) => {
  const toast = useToast();
  const [form, setForm] = useState<PostFormType>(initialData as PostFormType);
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [fontFamily, setFontFamily] = useState('Inter, sans-serif');
  const [fontSize, setFontSize] = useState('text-xl');
  const [previewTextColor, setPreviewTextColor] = useState('#0f172a');
  const [previewBgColor, setPreviewBgColor] = useState('#fff');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [showMediaPicker, setShowMediaPicker] = useState<"cover" | "insert" | "gallery" | null>(null);

  const catalogueIdNum = form.catalogueId
    ? typeof form.catalogueId === 'string'
      ? Number(form.catalogueId)
      : form.catalogueId
    : form.catalogue?.id;

  const { data: cataloguePosts = [] } = useGetPostsByCatalogueQuery(
    catalogueIdNum !== undefined ? catalogueIdNum : 0,
    {
      skip: catalogueIdNum === undefined,
    }
  );

  // AI Content Generation handlers
  const handleContentGenerated = (newContent: string) => {
    setForm(prev => ({ ...prev, content: newContent }));
  };

  const handleApplySeo = (seoFields: { meta_title?: string; meta_description?: string; slug?: string }) => {
    setForm(prev => ({ ...prev, ...seoFields }));
  };

  useEffect(() => {
    api.get('/post-catalogues').then(res => setCatalogues(res.data));
  }, []);

  useEffect(() => {
    setForm(initialData as PostFormType);
    if (initialData && Array.isArray(initialData.galleryImages)) {
      setGalleryImages(initialData.galleryImages);
    } else {
      setGalleryImages([]);
    }
  }, [initialData]);

  // Compute order options: standard CMS logic
  const totalPosts = cataloguePosts.length;
  const isEditing = !!form.id;
  const maxOrder = isEditing ? totalPosts : totalPosts + 1;
  const orderOptions: number[] = [];
  for (let i = 1; i <= maxOrder; i++) {
    orderOptions.push(i);
  }

  // Set default order when creating (not editing)
  useEffect(() => {
    if (!form.id && catalogueIdNum && !form.order) {
      setForm(f => ({ ...f, order: totalPosts + 1 }));
    }
    // When editing, always set order from initialData (handled by initialData effect)
    // eslint-disable-next-line
  }, [catalogueIdNum, totalPosts]);

  // When initialData changes (editing), always set order from initialData
  useEffect(() => {
    setForm(initialData as PostFormType);
    if (initialData && Array.isArray(initialData.galleryImages)) {
      setGalleryImages(initialData.galleryImages);
    } else {
      setGalleryImages([]);
    }
  }, [initialData]);

  // Markdown helpers
  const insertMarkdown = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = form.content?.slice(start, end) || '';
    const beforeText = form.content?.slice(0, start) || '';
    const afterText = form.content?.slice(end) || '';
    const insertText = selected || placeholder;
    const newContent = beforeText + before + insertText + after + afterText;
    setForm({ ...form, content: newContent });
    setTimeout(() => {
      // Only set selection if textarea is focused
      if (document.activeElement === textarea) {
        if (selected) {
          textarea.selectionStart = start + before.length;
          textarea.selectionEnd = start + before.length + insertText.length;
        } else {
          textarea.selectionStart = textarea.selectionEnd = start + before.length + insertText.length + after.length;
        }
      }
      // Do NOT call textarea.focus() here!
    }, 0);
  };

  // Toolbar actions
  const handleInsertHeading = (level: number) => insertMarkdown('\n' + '#'.repeat(level) + ' ', '');
  const handleInsertBold = () => insertMarkdown('**', '**', 'bold text');
  const handleInsertItalic = () => insertMarkdown('_', '_', 'italic text');
  const handleInsertUnderline = () => insertMarkdown('<u>', '</u>', 'underlined text');
  const handleInsertImage = () => setShowMediaPicker("insert");
  const handleInsertHr = () => insertMarkdown('\n\n---\n\n');
  const handleParagraphBreak = () => insertMarkdown('\n\n');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "canonical") {
      // Replace spaces with hyphens, remove non-url-safe chars, and lowercase
      const sanitized = value
        .replace(/\s+/g, "-")        // spaces to hyphens
        .replace(/[^a-zA-Z0-9-]/g, "") // remove special chars except hyphen
        .toLowerCase();
      setForm({ ...form, [name]: sanitized });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const catalogueIdValue =
      form.catalogueId !== undefined && form.catalogueId !== ''
        ? typeof form.catalogueId === 'string'
          ? Number(form.catalogueId)
          : form.catalogueId
        : form.catalogue?.id;

    const payload = {
      ...form,
      catalogueId:
        catalogueIdValue !== undefined &&
        (typeof catalogueIdValue !== 'string' || catalogueIdValue !== '')
          ? Number(catalogueIdValue)
          : undefined,
      galleryImages,
      textColor: previewTextColor,
      bgColor: previewBgColor,
      fontFamily,
      fontSize,
    };

    // Ensure catalogueId is a number or undefined for API compatibility
    if (typeof payload.catalogueId !== "number" && payload.catalogueId !== undefined) {
      payload.catalogueId = undefined;
    }
    try {
      if (form.id) {
        await updatePost({ id: form.id, body: payload });
        toast({ title: "Bài viết đã được cập nhật!", status: "success", duration: 3000, isClosable: true });
      } else {
        await createPost(payload);
        toast({ title: "Bài viết đã được tạo!", status: "success", duration: 3000, isClosable: true });
      }
      if (onSuccess) onSuccess();
    } catch {
      toast({ title: "Có lỗi khi lưu bài viết", status: "error", duration: 4000, isClosable: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100/70 via-white/80 to-blue-200/70 backdrop-blur-sm">
      {/* Main Modal Content */}
      <div className="relative w-full max-w-[1600px] mx-auto pointer-events-none">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 z-10 bg-white border border-gray-200 rounded-full shadow p-2 hover:bg-blue-50 transition pointer-events-auto"
          onClick={onSuccess}
          aria-label="Đóng"
          type="button"
        >
          <span className="text-2xl leading-none">&times;</span>
        </button>
        {/* Main Form Box */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-8 h-[95vh] w-full min-w-[1200px] bg-white rounded-3xl shadow-2xl p-0 overflow-hidden pointer-events-auto border border-blue-100"
          style={{ minHeight: 0 }}
        >
          {/* Main Content Section */}
          <div className="flex-[2] min-w-[700px] max-w-[1100px] flex flex-col h-full">
            <div className="flex-1 flex flex-col overflow-y-auto">
              {/* Post Info */}
              <div className="p-8 border-b bg-gradient-to-r from-blue-50 to-white shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-semibold mb-1 text-blue-900">Tiêu đề</label>
                    <input
                      name="name"
                      value={form.name || ''}
                      onChange={handleChange}
                      placeholder="Nhập tiêu đề bài viết"
                      className="w-full border border-blue-100 rounded-lg p-3 text-2xl font-bold bg-blue-50 focus:ring-2 focus:ring-blue-300 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-blue-900">Đường dẫn (Canonical)</label>
                    <input
                      name="canonical"
                      value={form.canonical || ''}
                      onChange={handleChange}
                      placeholder="Nhập đường dẫn"
                      className="w-full border border-blue-100 rounded-lg p-3 text-lg bg-blue-50 focus:ring-2 focus:ring-blue-300 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-blue-900">Danh mục</label>
                    <select
                      name="catalogueId"
                      value={form.catalogueId || form.catalogue?.id || ''}
                      onChange={handleChange}
                      className="w-full border border-blue-100 rounded-lg p-3 text-lg bg-blue-50 focus:ring-2 focus:ring-blue-300 transition"
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      {catalogues.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-blue-900">Thứ tự hiển thị</label>
                    <select
                      name="order"
                      value={form.order ?? ''} // <-- Updated line
                      onChange={handleChange}
                      className="w-full border border-blue-100 rounded-lg p-3 text-lg bg-blue-50 focus:ring-2 focus:ring-blue-300 transition"
                      required
                    >
                      <option value="">Chọn thứ tự</option>
                      {orderOptions.map(i => (
                        <option key={i} value={i}>
                          {i === 1 ? "1 (Nổi bật)" : i}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block font-semibold mb-1 text-blue-900">Mô tả</label>
                  <textarea
                    name="description"
                    value={form.description || ''}
                    onChange={handleChange}
                    placeholder="Nhập mô tả ngắn cho bài viết"
                    rows={2}
                    className="w-full border border-blue-100 rounded-lg p-3 text-lg bg-blue-50 focus:ring-2 focus:ring-blue-300 transition"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                  <input
                    name="meta_title"
                    value={form.meta_title || ''}
                    onChange={handleChange}
                    placeholder="Meta Title"
                    className="border border-blue-100 rounded-lg p-3 text-lg bg-blue-50 focus:ring-2 focus:ring-blue-300 transition"
                  />
                  <input
                    name="meta_description"
                    value={form.meta_description || ''}
                    onChange={handleChange}
                    placeholder="Meta Description"
                    className="border border-blue-100 rounded-lg p-3 text-lg bg-blue-50 focus:ring-2 focus:ring-blue-300 transition"
                  />
                  <input
                    name="meta_keyword"
                    value={form.meta_keyword || ''}
                    onChange={handleChange}
                    placeholder="Meta Keyword"
                    className="border border-blue-100 rounded-lg p-3 text-lg bg-blue-50 focus:ring-2 focus:ring-blue-300 transition"
                  />
                </div>
                {/* Cover Image Picker */}
                <div className="mt-8 px-0">
                  <label className="block font-semibold mb-2 text-lg text-blue-900">Ảnh bìa</label>
                  <div className="flex items-center gap-4 flex-wrap">
                    <button
                      type="button"
                      className="bg-blue-100 text-blue-700 rounded-lg px-4 py-2 hover:bg-blue-200 text-base font-medium shadow-sm transition"
                      onClick={() => setShowMediaPicker("cover")}
                    >
                      {form.image ? "Đổi ảnh bìa" : "Chọn từ thư viện"}
                    </button>
                    {form.image && (
                      <button
                        type="button"
                        className="bg-gray-200 text-gray-600 rounded-lg px-3 py-2 hover:bg-gray-300 text-sm font-medium shadow-sm transition"
                        onClick={() => setForm(f => ({ ...f, image: undefined }))}
                        aria-label="Xóa ảnh bìa"
                        title="Xóa ảnh bìa"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                  {form.image && (
                    <img
                      src={form.image}
                      alt="Ảnh bìa"
                      className="w-32 h-32 object-cover rounded-xl mt-4 border border-blue-100 shadow"
                    />
                  )}
                </div>
              </div>
              {/* Content Editor Area */}
              <div className="flex-1 bg-white px-8 py-8 flex flex-col">
                <div className="mb-4">
                  <PostFormToolbar
                    onHeading={handleInsertHeading}
                    onBold={handleInsertBold}
                    onItalic={handleInsertItalic}
                    onUnderline={handleInsertUnderline}
                    onImage={handleInsertImage}
                    onHr={handleInsertHr}
                    onParagraphBreak={handleParagraphBreak}
                    previewTextColor={previewTextColor}
                    previewBgColor={previewBgColor}
                    showColorPicker={showColorPicker}
                    showBgColorPicker={showBgColorPicker}
                    setShowColorPicker={setShowColorPicker}
                    setShowBgColorPicker={setShowBgColorPicker}
                    setPreviewTextColor={setPreviewTextColor}
                    setPreviewBgColor={setPreviewBgColor}
                    COLORS={COLORS}
                    BG_COLORS={BG_COLORS}
                    fontFamily={fontFamily}
                    setFontFamily={setFontFamily}
                    fontSize={fontSize}
                    setFontSize={setFontSize}
                    FONT_FAMILIES={FONT_FAMILIES}
                    FONT_SIZES={FONT_SIZES}
                    publish={!!form.publish}
                    setPublish={v => setForm({ ...form, publish: v })}
                    onOpenGalleryPicker={() => setShowMediaPicker("gallery")}
                    images={galleryImages}
                    onGalleryImageInsert={url => {
                      insertMarkdown(`\n\n![](${url})\n\n`);
                    }}
                  />
                </div>
                <textarea
                  ref={textareaRef}
                  name="content"
                  value={form.content || ''}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Viết bài bằng Markdown..."
                  className="w-full flex-1 min-h-[600px] max-h-[1200px] border-none outline-none rounded-xl p-10 font-serif text-2xl bg-blue-50 shadow-inner focus:ring-2 focus:ring-blue-400 transition-all resize-vertical leading-relaxed"
                  style={{
                    fontFamily,
                    fontSize: fontSize === 'text-base' ? '1.25rem' : fontSize === 'text-lg' ? '1.5rem' : '2rem',
                    color: previewTextColor,
                    background: previewBgColor,
                    lineHeight: 1.8,
                    letterSpacing: "0.01em",
                  }}
                  required
                />
                {/* Gallery below editor */}
                {galleryImages.length > 0 && (
                  <div className="w-full mt-6">
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 border rounded-xl bg-blue-50 px-3" style={{ maxHeight: 90 }}>
                      {galleryImages.map((img, idx) => (
                        <div key={idx} className="relative group flex-shrink-0">
                          <img
                            src={img}
                            alt={`Gallery ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded-xl border border-blue-100 shadow"
                          />
                          <button
                            type="button"
                            className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1 text-xs text-red-500 hover:bg-red-100 transition"
                            style={{ transform: 'translate(30%,-30%)' }}
                            onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== idx))}
                            title="Xóa"
                          >
                            ×
                          </button>
                          <button
                            type="button"
                            className="absolute bottom-0 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-tr-xl rounded-bl-xl opacity-80 hover:opacity-100 transition"
                            onClick={() => insertMarkdown(`\n\n![](${img})\n\n`)}
                            title="Chèn vào bài viết"
                          >
                            Chèn
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Submit Button */}
              <div className="border-t bg-gradient-to-r from-blue-50 to-white px-8 py-6 flex justify-end shrink-0">
                <button type="submit" className="bg-blue-600 text-white px-10 py-4 text-xl rounded-xl font-semibold hover:bg-blue-700 shadow transition">
                  {form.id ? 'Cập nhật' : 'Tạo mới'} bài viết
                </button>
              </div>
            </div>
          </div>
          {/* Sidebar: Live Preview & Customization */}
          <PostFormSidebar
            form={form}
            catalogues={catalogues}
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
            onContentGenerated={handleContentGenerated}
            onApplySeo={handleApplySeo}
          />
        </form>
      </div>
      {/* MediaPicker is rendered here, outside the modal content, so it overlays only when open */}
      <MediaPicker
        show={!!showMediaPicker}
        multiple={showMediaPicker === "insert" || showMediaPicker === "gallery"}
        onSelect={imgs => {
          if (showMediaPicker === "cover") {
            const img = Array.isArray(imgs) ? imgs[0] : imgs;
            setForm(f => ({ ...f, image: img.url }));
          } else if (showMediaPicker === "insert") {
            const arr = Array.isArray(imgs) ? imgs : [imgs];
            arr.forEach(img => {
              insertMarkdown(`\n\n![](${img.url})\n\n`);
            });
          } else if (showMediaPicker === "gallery") {
            const arr = Array.isArray(imgs) ? imgs : [imgs];
            setGalleryImages(prev => [...prev, ...arr.map(i => i.url)]);
          }
          setShowMediaPicker(null);
        }}
        onClose={() => setShowMediaPicker(null)}
      />
    </div>
  );
};

export default PostForm;