import React from 'react';
import ReactMarkdown from 'react-markdown';

interface BlogPostPreviewProps {
  title?: string;
  description?: string;
  image?: string;
  catalogueName?: string;
  date?: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  meta_keyword?: string;
  canonical?: string;
  fontFamily?: string;
  fontSize?: string;
  textColor?: string;
  bgColor?: string;
  publish?: boolean;
}

const BlogPostPreview: React.FC<BlogPostPreviewProps> = ({
  title,
  description,
  image,
  catalogueName,
  date,
  content,
  meta_title,
  meta_description,
  meta_keyword,
  canonical,
  fontFamily = 'sans-serif',
  fontSize = 'text-lg',
  textColor = '#0f172a',
  bgColor = '#fff',
  publish = true,
}) => {
  return (
    <article
      className="rounded-3xl overflow-hidden border max-w-2xl mx-auto shadow-2xl bg-white animate-fade-in"
      style={{
        fontFamily,
        background: bgColor,
        color: textColor,
        transition: 'background 0.2s, color 0.2s',
        minHeight: 200,
        maxHeight: 700,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Banner image or placeholder */}
      <div className="h-56 w-full bg-gradient-to-br from-blue-100 to-white flex items-center justify-center overflow-hidden relative flex-shrink-0">
        {image ? (
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full transition-all duration-300 rounded-t-3xl"
          />
        ) : (
          <span className="text-gray-300 text-5xl">🖼️</span>
        )}
        {!publish && (
          <span className="absolute top-3 right-3 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            Draft
          </span>
        )}
      </div>
      <div
        className={`p-6 sm:p-8 md:p-10 ${fontSize} overflow-y-auto`}
        style={{ flex: 1, minHeight: 0 }}
      >
        {/* Tag & Date */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {catalogueName && (
            <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold shadow">
              {catalogueName}
            </span>
          )}
          {date && (
            <span className="text-gray-400 text-xs flex items-center gap-1">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" className="inline-block"><path stroke="currentColor" strokeWidth="2" d="M8 7V3m8 4V3M3 11h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/></svg>
              {date}
            </span>
          )}
        </div>
        {/* Title */}
        {title && (
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 leading-tight break-words" style={{ color: textColor }}>
            {title}
          </h1>
        )}
        {/* Description/Excerpt */}
        {description && (
          <div className="mb-6 italic text-gray-500 text-base">{description}</div>
        )}
        {/* Markdown Content */}
        <div
          className="prose prose-blue max-w-none mb-8"
          style={{ color: textColor }}
        >
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        {/* Meta info */}
        <div className="border-t pt-4 text-xs text-gray-400 space-y-1 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          {meta_title && <div><span className="font-semibold text-gray-500">Meta Title:</span> {meta_title}</div>}
          {meta_description && <div><span className="font-semibold text-gray-500">Meta Desc:</span> {meta_description}</div>}
          {meta_keyword && <div><span className="font-semibold text-gray-500">Meta Keyword:</span> {meta_keyword}</div>}
          {canonical && <div><span className="font-semibold text-gray-500">Canonical:</span> {canonical}</div>}
        </div>
      </div>
    </article>
  );
};

export default BlogPostPreview;