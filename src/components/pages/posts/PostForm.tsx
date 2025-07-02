import React, { useState, useEffect, useRef } from 'react';
import { useCreatePostMutation, useUpdatePostMutation, type Post } from '../../../redux/postsApi';
import api from '../../../api/axios-client';
import PostFormToolbar from './PostFormToolbar';
import PostFormSidebar from './PostFormSidebar';
import { useToast } from '@chakra-ui/react'; // or your toast lib

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

function isCloudinaryUrl(url: string) {
  return /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//.test(url);
}

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
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const toast = useToast();

  useEffect(() => {
    api.get('/post-catalogues').then(res => setCatalogues(res.data));
  }, []);

  useEffect(() => {
    setForm(initialData);
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
  const handleInsertHeading = (level: number) => insertMarkdown('\n' + '#'.repeat(level) + ' ', '');
  const handleInsertBold = () => insertMarkdown('**', '**', 'bold text');
  const handleInsertItalic = () => insertMarkdown('_', '_', 'italic text');
  const handleInsertUnderline = () => insertMarkdown('<u>', '</u>', 'underlined text');
  const handleInsertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) insertMarkdown(`\n\n![alt text](${url})\n\n`);
  };
  const handleInsertHr = () => insertMarkdown('\n\n---\n\n');

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    if (url && !isCloudinaryUrl(url)) {
      toast({
        title: 'Invalid Image URL',
        description: 'Please use a valid Cloudinary image URL.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    setForm(f => ({ ...f, image: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      catalogueId: form.catalogueId || form.catalogue?.id,
      galleryImages,
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
      <div className="relative w-full max-w-[1600px] mx-auto bg-transparent">
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
          className="flex flex-col md:flex-row gap-8 h-[95vh] w-full min-w-[1200px] bg-white rounded-2xl shadow-2xl p-0 overflow-hidden"
          style={{ minHeight: 0 }}
        >
          {/* Info & Editor Section */}
          <div className="flex-[2] min-w-[600px] max-w-[1100px] flex flex-col h-full">
            {/* Post Info */}
            <div className="p-8 border-b bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-1">Title</label>
                  <input
                    name="name"
                    value={form.name || ''}
                    onChange={handleChange}
                    placeholder="Title"
                    className="w-full border rounded p-3 text-lg"
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
                    className="w-full border rounded p-3 text-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Catalogue</label>
                  <select
                    name="catalogueId"
                    value={form.catalogueId || form.catalogue?.id || ''}
                    onChange={handleChange}
                    className="w-full border rounded p-3 text-lg"
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
                    className="w-full border rounded p-3 text-lg"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description || ''}
                  onChange={handleChange}
                  placeholder="Description"
                  rows={2}
                  className="w-full border rounded p-3 text-lg"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                <input
                  name="meta_title"
                  value={form.meta_title || ''}
                  onChange={handleChange}
                  placeholder="Meta Title"
                  className="border rounded p-3 text-lg"
                />
                <input
                  name="meta_description"
                  value={form.meta_description || ''}
                  onChange={handleChange}
                  placeholder="Meta Description"
                  className="border rounded p-3 text-lg"
                />
                <input
                  name="meta_keyword"
                  value={form.meta_keyword || ''}
                  onChange={handleChange}
                  placeholder="Meta Keyword"
                  className="border rounded p-3 text-lg"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                <input
                  name="image"
                  value={form.image || ''}
                  onChange={handleImageChange}
                  placeholder="Cloudinary image URL"
                  className="border rounded p-2 w-full"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Only Cloudinary URLs are accepted (e.g. https://res.cloudinary.com/...)
              </p>
            </div>
            {/* Markdown Editor */}
            <div className="flex-1 bg-gray-50 px-0 py-0 overflow-y-auto flex flex-col">
              {/* Sticky Toolbar */}
              <div className="sticky top-0 z-10 bg-white border-b">
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
                  onImageAdd={handleGalleryImageAdd}
                  images={galleryImages}
                  onGalleryImageInsert={url => {
                    insertMarkdown(`\n\n![alt text](${url})\n\n`);
                  }}
                />
              </div>
              {/* Editor */}
              <div className="flex-1 flex flex-col">
                <textarea
                  ref={textareaRef}
                  name="content"
                  value={form.content || ''}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Write your post in Markdown..."
                  className="w-full flex-1 min-h-[700px] max-h-[1200px] border-none outline-none rounded-b-xl p-10 font-mono text-2xl bg-white shadow-inner focus:ring-2 focus:ring-blue-400 transition-all resize-vertical"
                  style={{
                    fontFamily,
                    fontSize: fontSize === 'text-base' ? '1.25rem' : fontSize === 'text-lg' ? '1.5rem' : '2rem',
                    lineHeight: 1.8,
                  }}
                  required
                />
                {/* Gallery below editor */}
                {galleryImages.length > 0 && (
                  <div className="w-full mt-4">
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 border rounded bg-gray-50 px-3" style={{ maxHeight: 90 }}>
                      {galleryImages.map((img, idx) => (
                        <div key={idx} className="relative group flex-shrink-0">
                          <img
                            src={img}
                            alt={`Gallery ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded border"
                          />
                          <button
                            type="button"
                            className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1 text-xs text-red-500 hover:bg-red-100 transition"
                            style={{ transform: 'translate(30%,-30%)' }}
                            onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== idx))}
                            title="Remove"
                          >
                            ×
                          </button>
                          <button
                            type="button"
                            className="absolute bottom-0 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-tr rounded-bl opacity-80 hover:opacity-100 transition"
                            onClick={() => insertMarkdown(`\n\n![alt text](${img})\n\n`)}
                            title="Insert into post"
                          >
                            Insert
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Submit Button */}
            <div className="border-t bg-white px-8 py-6 flex justify-end">
              <button type="submit" className="bg-blue-600 text-white px-10 py-4 text-xl rounded font-semibold hover:bg-blue-700 transition">
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