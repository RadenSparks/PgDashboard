'use client';

import { useState } from 'react';
import BlogPostPreview from './BlogPostPreview';

const CreatePostPage = () => {
  const [postData, setPostData] = useState({
    title: 'Tiêu đề của bạn',
    content: 'Nội dung bài viết...',
    meta_title: '',
    meta_description: '',
  });

  const handleContentGenerated = (newContent: string) => {
    setPostData(prev => ({ ...prev, content: newContent }));
  };

  const handleApplySeo = (seoFields: Record<string, unknown>) => {
    setPostData(prev => ({ ...prev, ...seoFields }));
  };

  return (
    <div>
      {/* Form chỉnh sửa dữ liệu */}
      <label className="block mb-1 font-medium text-gray-700">Tiêu đề bài viết</label>
      <input 
        value={postData.title} 
        onChange={(e) => setPostData(p => ({ ...p, title: e.target.value }))} 
        className="border rounded px-3 py-2 mb-3 w-full"
        placeholder="Nhập tiêu đề bài viết"
      />
      <label className="block mb-1 font-medium text-gray-700">Nội dung bài viết</label>
      <textarea 
        value={postData.content}
        onChange={(e) => setPostData(p => ({ ...p, content: e.target.value }))}
        className="border rounded px-3 py-2 mb-6 w-full"
        rows={8}
        placeholder="Nhập nội dung bài viết..."
      />

      {/* Hiển thị bản xem trước */}
      <BlogPostPreview
        title={postData.title}
        content={postData.content}
        onApplySeo={handleApplySeo}
        onContentGenerated={handleContentGenerated}
      />
    </div>
  );
};

export default CreatePostPage;