'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FiBarChart2, FiX } from 'react-icons/fi';

// Data type for the SEO report from n8n
interface SeoReport {
  seo_score: number;
  seo_analysis: {
    overall_comment: string;
    suggestions: string[];
  };
  generated_seo: {
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    slug: string;
  };
}

interface BlogPostPreviewProps {
  // Your current props
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
  // Prop to update the parent form when "Apply" is clicked
  onApplySeo: (fields: Partial<SeoReport['generated_seo']>) => void;
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
  fontFamily = 'sans-serif',
  fontSize = 'text-lg',
  textColor = '#0f172a',
  bgColor = '#fff',
  onApplySeo,
}) => {
  const [showSeoScore, setShowSeoScore] = useState(false);
  
  // CORRECTED STATE to store the structured JSON report
  const [seoData, setSeoData] = useState<{
    isLoading: boolean;
    error: string | null;
    report: SeoReport | null;
  }>({
    isLoading: false,
    error: null,
    report: null,
  });

  const fetchSeoScore = async () => {
    try {
      setSeoData({ isLoading: true, error: null, report: null });

      const response = await fetch('https://103226109.flown8n.com/webhook/853df892-3ca0-4f8a-9a84-ebb96950f091', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // CORRECTED LOGIC to handle the nested "output" key from n8n
      const responseData = await response.json();
      const reportData: SeoReport = responseData.output; 
      
      setSeoData({
        isLoading: false,
        error: null,
        report: reportData, // Store the entire report object
      });

      setShowSeoScore(true);
    } catch (error) {
      console.error('Error fetching SEO score:', error);
      setSeoData({
        isLoading: false,
        error: 'Failed to fetch SEO analysis',
        report: null
      });
      setShowSeoScore(true);
    }
  };

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
      <div className="h-56 w-full bg-gradient-to-br from-blue-100 to-white flex items-center justify-center overflow-hidden relative flex-shrink-0">
        {image ? (
          <img src={image} alt={title} className="object-cover w-full h-full"/>
        ) : (
          <span className="text-gray-300 text-5xl">🖼️</span>
        )}
      </div>
      <div className={`p-6 sm:p-8 md:p-10 ${fontSize} overflow-y-auto`} style={{ flex: 1, minHeight: 0 }}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {catalogueName && (
                <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold shadow">
                  {catalogueName}
                </span>
              )}
              {date && (
                <span className="text-gray-400 text-xs">{date}</span>
              )}
            </div>
            <button
                onClick={fetchSeoScore}
                disabled={seoData.isLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <FiBarChart2 className="w-3.5 h-3.5" />
                {seoData.isLoading ? 'Analyzing...' : 'Check SEO Score'}
            </button>
        </div>
        
        {title && <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">{title}</h1>}
        {description && <div className="mb-6 italic text-gray-500">{description}</div>}
        
        {/* SEO Score Modal */}
        {showSeoScore && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
              <div className="border-b p-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">SEO Analysis</h3>
                <button onClick={() => setShowSeoScore(false)} className="text-gray-400 hover:text-gray-600">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                {seoData.error ? (
                  <div className="text-red-500">{seoData.error}</div>
                ) : seoData.isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : seoData.report ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-base font-semibold text-gray-800">Overall Analysis</h4>
                      <div className="mt-2 flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="text-4xl font-bold text-blue-600">{seoData.report?.seo_score}<span className="text-2xl text-gray-400">/100</span></div>
                        <p className="text-sm text-gray-600">{seoData.report?.seo_analysis?.overall_comment}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-800">Improvement Suggestions</h4>
                      <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-gray-700">
                        {seoData.report?.seo_analysis?.suggestions?.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-800">Suggested SEO Content</h4>
                      <div className="mt-2 space-y-3 text-sm">
                        <div className="p-3 bg-gray-50 rounded-md">
                          <label className="block font-medium text-gray-600">Meta Title</label>
                          <p className="mt-1 text-gray-900">{seoData.report?.generated_seo?.meta_title}</p>
                          <button onClick={() => onApplySeo({ meta_title: seoData.report?.generated_seo?.meta_title })} className="text-blue-600 hover:underline text-xs mt-1 font-semibold">Apply</button>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-md">
                          <label className="block font-medium text-gray-600">Meta Description</label>
                          <p className="mt-1 text-gray-900">{seoData.report?.generated_seo?.meta_description}</p>
                          <button onClick={() => onApplySeo({ meta_description: seoData.report?.generated_seo?.meta_description })} className="text-blue-600 hover:underline text-xs mt-1 font-semibold">Apply</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="border-t p-4 flex justify-end">
                <button onClick={() => setShowSeoScore(false)} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="prose prose-blue max-w-none mb-8" style={{ color: textColor }}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        <div className="border-t pt-4 text-xs text-gray-400 space-y-1 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          {meta_title && <div><span className="font-semibold">Meta Title:</span> {meta_title}</div>}
          {meta_description && <div><span className="font-semibold">Meta Desc:</span> {meta_description}</div>}
        </div>
      </div>
    </article>
  );
};

export default BlogPostPreview;