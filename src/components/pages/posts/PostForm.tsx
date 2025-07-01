import React, { useState, useEffect, useRef } from 'react';
import { useCreatePostMutation, useUpdatePostMutation, type Post } from '../../../redux/postsApi';
import api from '../../../api/axios-client';
import PostFormToolbar from './PostFormToolbar';
import PostFormSidebar from './PostFormSidebar';

interface Props {
  initialData?: Partial<Post>;
  onSuccess?: () => void;
}

interface Catalogue {
  id: number;
  name: string;
}

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

const PostForm: React.FC<Props> = ({ initialData = {}, onSuccess }) => {
  const [form, setForm] = useState<Partial<Post>>(initialData);
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [fontFamily, setFontFamily] = useState('sans-serif');
  const [fontSize, setFontSize] = useState('text-lg');
  const [previewTextColor, setPreviewTextColor] = useState('#000000');
  const [previewBgColor, setPreviewBgColor] = useState('#ffffff');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);

  // Gallery images state for the post
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    api.get('/post-catalogues').then(res => setCatalogues(res.data));
  }, []);

  useEffect(() => {
    setForm(initialData);
    // If editing, load gallery images from initialData if available
    if (initialData && Array.isArray(initialData.galleryImages)) {
      setGalleryImages(initialData.galleryImages);
    } else {
      setGalleryImages([]);
    }
  }, [initialData]);

  // Helper to insert markdown at cursor, wrapping selection if present
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
      textarea.focus();
      if (selected) {
        textarea.selectionStart = start + before.length;
        textarea.selectionEnd = start + before.length + insertText.length;
      } else {
        textarea.selectionStart = textarea.selectionEnd = start + before.length + insertText.length + after.length;
      }
    }, 0);
  };

  // Toolbar actions
  const handleInsertHeading = (level: number) => {
    insertMarkdown('\n' + '#'.repeat(level) + ' ', '');
  };

  const handleInsertBold = () => {
    insertMarkdown('**', '**', 'bold text');
  };

  const handleInsertItalic = () => {
    insertMarkdown('_', '_', 'italic text');
  };

  const handleInsertUnderline = () => {
    insertMarkdown('<u>', '</u>', 'underlined text');
  };

  const handleInsertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) insertMarkdown(`\n\n![alt text](${url})\n\n`);
  };

  const handleInsertHr = () => {
    insertMarkdown('\n\n---\n\n');
  };

  // Gallery image upload handler
  const handleGalleryImageAdd = (files: FileList) => {
    const fileArr = Array.from(files);
    const readers = fileArr.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(imgs => {
      setGalleryImages(prev => [...prev, ...imgs]);
    });
  };

  // Undo support (Ctrl+Z is handled natively by textarea, but we can ensure focus)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      catalogueId: form.catalogueId || form.catalogue?.id,
      galleryImages, // Save gallery images with the post
    };
    if (form.id) {
      await updatePost({ id: form.id, body: payload });
    } else {
      await createPost(payload);
    }
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative w-full max-w-6xl mx-auto bg-transparent">
        {/* Collapse/Close Button */}
        <button
          className="absolute top-4 right-4 z-10 bg-white border border-gray-200 rounded-full shadow p-2 hover:bg-gray-100 transition"
          onClick={onSuccess}
          aria-label="Close"
          type="button"
        >
          <span className="text-2xl leading-none">&times;</span>
        </button>
        {/* Main Form Box */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-8 h-[80vh] w-full min-w-[900px] bg-white rounded-2xl shadow-2xl p-0 overflow-hidden"
          style={{ minHeight: 0 }}
        >
          {/* Info & Editor Section */}
          <div className="flex-[2] min-w-[380px] max-w-[700px] flex flex-col h-full">
            {/* Post Info */}
            <div className="p-6 border-b bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Title</label>
                  <input
                    name="name"
                    value={form.name || ''}
                    onChange={handleChange}
                    placeholder="Title"
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Canonical</label>
                  <input
                    name="canonical"
                    value={form.canonical || ''}
                    onChange={handleChange}
                    placeholder="Canonical"
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Catalogue</label>
                  <select
                    name="catalogueId"
                    value={form.catalogueId || form.catalogue?.id || ''}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    required
                  >
                    <option value="">Select Catalogue</option>
                    {catalogues.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Order</label>
                  <input
                    name="order"
                    type="number"
                    value={form.order || ''}
                    onChange={handleChange}
                    placeholder="Order"
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description || ''}
                  onChange={handleChange}
                  placeholder="Description"
                  rows={2}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
                <input
                  name="meta_title"
                  value={form.meta_title || ''}
                  onChange={handleChange}
                  placeholder="Meta Title"
                  className="border rounded p-2"
                />
                <input
                  name="meta_description"
                  value={form.meta_description || ''}
                  onChange={handleChange}
                  placeholder="Meta Description"
                  className="border rounded p-2"
                />
                <input
                  name="meta_keyword"
                  value={form.meta_keyword || ''}
                  onChange={handleChange}
                  placeholder="Meta Keyword"
                  className="border rounded p-2"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                <input
                  name="image"
                  value={form.image || ''}
                  onChange={handleChange}
                  placeholder="Image URL"
                  className="border rounded p-2"
                />
              </div>
            </div>
            {/* Toolbar */}
            <PostFormToolbar
              onHeading={handleInsertHeading}
              onBold={handleInsertBold}
              onItalic={handleInsertItalic}
              onUnderline={handleInsertUnderline}
              onImage={handleInsertImage}
              onHr={handleInsertHr}
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
              // Gallery integration
              onImageAdd={handleGalleryImageAdd}
              images={galleryImages}
              onGalleryImageInsert={url => {
                // Insert markdown for image at cursor
                insertMarkdown(`\n\n![alt text](${url})\n\n`);
              }}
            />
            {/* Markdown Editor */}
            <div className="flex-1 bg-gray-50 px-6 py-4 overflow-y-auto">
              <textarea
                ref={textareaRef}
                name="content"
                value={form.content || ''}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Write your post in Markdown..."
                rows={12}
                className="w-full border rounded p-2"
                required
                style={{
                  fontFamily,
                  fontSize: fontSize === 'text-base' ? '1rem' : fontSize === 'text-lg' ? '1.125rem' : '1.5rem',
                }}
              />
            </div>
            {/* Submit Button */}
            <div className="border-t bg-white px-6 py-4 flex justify-end">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition">
                {form.id ? 'Update' : 'Create'} Post
              </button>
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
          />
        </form>
      </div>
    </div>
  );
};

export default PostForm;