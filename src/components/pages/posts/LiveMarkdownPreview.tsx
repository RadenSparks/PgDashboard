import React from 'react';
import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
  title?: string;
  description?: string;
  image?: string;
  catalogueName?: string;
  date?: string;
  fontFamily?: string;
  fontSize?: string;
  textColor?: string;
  bgColor?: string;
}

const LiveMarkdownPreview: React.FC<Props> = ({
  content,
  title,
  description,
  image,
  catalogueName,
  date,
  fontFamily = 'sans-serif',
  fontSize = 'text-lg',
  textColor = '#000000',
  bgColor = '#ffffff',
}) => (
  <div
    className={`rounded-2xl overflow-hidden border max-w-2xl mx-auto`}
    style={{
      fontFamily,
      background: bgColor,
      color: textColor,
      transition: 'background 0.2s, color 0.2s',
      minHeight: 200,
    }}
  >
    {image && (
      <div className="h-56 w-full bg-gray-200 flex items-center justify-center overflow-hidden">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full"
        />
      </div>
    )}
    <div className={`p-8 ${fontSize}`}>
      <div className="mb-4 flex items-center gap-2">
        {catalogueName && (
          <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
            {catalogueName}
          </span>
        )}
        {date && (
          <span className="text-gray-400 text-xs">{date}</span>
        )}
      </div>
      {title && (
        <h1 className="text-3xl font-extrabold mb-2" style={{ color: textColor }}>{title}</h1>
      )}
      {description && (
        <div className="mb-4 italic text-gray-500">Mô tả: {description}</div>
      )}
      <div className="prose prose-blue max-w-none" style={{ color: textColor }}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  </div>
);

export default LiveMarkdownPreview;