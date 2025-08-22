'use client';

import { useState } from 'react';
import BlogPostPreview from './BlogPostPreview'; // Your component

const CreatePostPage = () => {
  // The parent component manages the state
  const [postData, setPostData] = useState({
    title: 'Your Title',
    content: 'Your Content...',
    meta_title: '',
    meta_description: '',
  });

  // It defines the function that the child component will call
  const handleContentGenerated = (newContent: string) => {
    setPostData(prev => ({ ...prev, content: newContent }));
  };

  const handleApplySeo = (seoFields: Record<string, unknown>) => {
    setPostData(prev => ({ ...prev, ...seoFields }));
  };

  return (
    <div>
      {/* A form for editing the data */}
      <input 
        value={postData.title} 
        onChange={(e) => setPostData(p => ({ ...p, title: e.target.value }))} 
      />
      <textarea 
        value={postData.content}
        onChange={(e) => setPostData(p => ({ ...p, content: e.target.value }))}
      />

      {/* Renders the child and passes the required functions as props */}
      <BlogPostPreview
        title={postData.title}
        content={postData.content}
        onApplySeo={handleApplySeo}
        onContentGenerated={handleContentGenerated} // This line is required
      />
    </div>
  );
};

export default CreatePostPage;