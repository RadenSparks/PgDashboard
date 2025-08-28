'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { FiBarChart2, FiCpu, FiLoader, FiX } from 'react-icons/fi';

// --- CÁC KIỂU DỮ LIỆU ---
interface SeoReport {
  seo_score: number;
  seo_analysis: {
    overall_comment: string;
    suggestions: string[];
  };
  generated_seo: {
    meta_title: string;
    meta_description: string;
    slug: string;
  };
}

interface ArticleInput {
  topic: string;
  main_keyword: string;
  canonical?: string;
  catalogue?: string;
  description?: string;
}

interface BlogPostPreviewProps {
  title?: string;
  description?: string;
  image?: string;
  catalogueName?: string;
  canonical?: string;
  date?: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  meta_keyword?: string;
  fontFamily?: string;
  fontSize?: string;
  textColor?: string;
  bgColor?: string;
  publish?: boolean;
  onApplySeo: (fields: Partial<SeoReport['generated_seo']>) => void;
  onContentGenerated: (newContent: string) => void;
}

// --- COMPONENT CHÍNH ---
const BlogPostPreview: React.FC<BlogPostPreviewProps> = ({
  title,
  description,
  catalogueName,
  canonical,
  content,
  fontFamily = 'sans-serif',
  textColor = '#0f172a',
  bgColor = '#fff',
  onApplySeo,
  onContentGenerated,
  meta_title,
  meta_description,
  meta_keyword,
  publish,
}) => {
  const [showSeoModal, setShowSeoModal] = useState(false);
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);

  const [seoData, setSeoData] = useState({
    isLoading: false,
    error: null as string | null,
    report: null as SeoReport | null,
  });

  const [generatorData, setGeneratorData] = useState({
    isLoading: false,
    error: null as string | null,
    inputs: { 
      topic: title || '', 
      main_keyword: '',
      canonical: '',
      catalogue: '',
      description: ''
    } as ArticleInput,
  });
  
  useEffect(() => {
    setGeneratorData(prev => ({ 
      ...prev, 
      inputs: { 
        ...prev.inputs, 
        topic: title || '',
        canonical: canonical || '',
        catalogue: catalogueName || '',
        description: description || ''
      } 
    }));
  }, [title, canonical, catalogueName, description]);

  // --- LOGIC GỌI API ---

  const fetchSeoScore = async () => {
    setSeoData({ isLoading: true, error: null, report: null });
    setShowSeoModal(true);
    try {
      // Gợi ý: Nên đưa URL này vào file .env để quản lý tốt hơn
      const SEO_WEBHOOK_URL = 'https://103226109.flown8n.com/webhook/853df892-3ca0-4f8a-9a84-ebb96950f091';
      const response = await fetch(SEO_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });
      if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
      
      const responseData = await response.json();
      // FIX: Kiểm tra xem 'output' có tồn tại không trước khi gán
      const reportData: SeoReport = responseData.output;
      if (!reportData) {
        throw new Error("Định dạng phản hồi từ API không đúng.");
      }
      setSeoData({ isLoading: false, error: null, report: reportData });

    } catch (error: unknown) {
      // FIX: Hiển thị lỗi cụ thể thay vì một chuỗi cố định
      setSeoData({ 
        isLoading: false, 
        error: typeof error === 'object' && error !== null && 'message' in error ? (error as { message?: string }).message || 'Không thể phân tích SEO.' : 'Không thể phân tích SEO.', 
        report: null 
      });
    }
  };

  const handleGenerateArticle = async () => {
    if (!generatorData.inputs.topic || !generatorData.inputs.main_keyword) {
      setGeneratorData(prev => ({ ...prev, error: 'Chủ đề và từ khóa chính là bắt buộc.' }));
      return;
    }
    setGeneratorData(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // Gợi ý: Nên đưa URL này vào file .env để quản lý tốt hơn
      const GENERATOR_WEBHOOK_URL = 'https://103226109.flown8n.com/webhook/b9ceeed3-cb56-4b6e-b523-d85a2a94f90b';
      const response = await fetch(GENERATOR_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatorData.inputs),
      });
      if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
      const result = await response.json();
      if (result.articleContent) {
        onContentGenerated(result.articleContent); // It tries to call the function here.
      } else {
        throw new Error("API không trả về nội dung.");
      }
    } catch (error: unknown) {
      setGeneratorData(prev => ({
        ...prev,
        error:
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message?: string }).message || 'Không thể tạo nội dung.'
            : 'Không thể tạo nội dung.',
      }));
    } finally {
      setGeneratorData(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <article className="rounded-3xl overflow-hidden border max-w-2xl mx-auto shadow-2xl bg-white animate-fade-in"
      style={{
        fontFamily,
        background: bgColor,
        color: textColor,
        transition: 'background 0.2s, color 0.2s',
        minHeight: 200,
        maxHeight: 700,
        display: 'flex',
        flexDirection: 'column',
      }}>
      <div className="p-3 border-b flex justify-end gap-2 bg-gray-50/70 flex-shrink-0">
        <button
          onClick={() => setShowGeneratorModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors bg-blue-50 text-blue-700 hover:bg-blue-100"
        >
          <FiCpu className="w-3.5 h-3.5" />
          Tạo Nội Dung
        </button>
        <button
          onClick={fetchSeoScore}
          disabled={seoData.isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50"
        >
          <FiBarChart2 className="w-3.5 h-3.5" />
          Phân Tích SEO
        </button>
      </div>

      <div className="p-6 sm:p-8 overflow-y-auto flex-grow">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">{title || "Tiêu đề sẽ hiện ở đây"}</h1>
        {/* --- Add meta/canonical/publish --- */}
        <div className="mb-2 flex flex-wrap gap-3 items-center text-xs text-gray-500">
          {canonical && <span className="bg-gray-100 px-2 py-0.5 rounded">/{canonical}</span>}
          {meta_title && <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">Meta Title: {meta_title}</span>}
          {meta_description && <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded">Meta Desc: {meta_description}</span>}
          {meta_keyword && <span className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded">Keyword: {meta_keyword}</span>}
          {publish === false && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded">Chưa công khai</span>}
        </div>
        <div className="prose prose-blue max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>

      {/* --- CÁC MODAL (POPUP) --- */}

      {showGeneratorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <div className="border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Tạo nội dung bằng AI</h3>
              <button onClick={() => setShowGeneratorModal(false)} className="text-gray-400 hover:text-gray-600"><FiX /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium">Chủ đề (Lấy từ tiêu đề)</label>
                <input type="text" value={generatorData.inputs.topic} disabled className="mt-1 block w-full bg-gray-100 p-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium">Từ khóa chính</label>
                <input 
                  type="text" 
                  value={generatorData.inputs.main_keyword}
                  onChange={(e) => setGeneratorData(p => ({ ...p, inputs: { ...p.inputs, main_keyword: e.target.value }}))}
                  className="mt-1 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="VD: tự động hóa marketing"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Canonical</label>
                <input 
                  type="text" 
                  value={generatorData.inputs.canonical}
                  onChange={(e) => setGeneratorData(p => ({ ...p, inputs: { ...p.inputs, canonical: e.target.value }}))}
                  className="mt-1 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="VD: tu-dong-hoa-marketing"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Danh mục</label>
                <input 
                  type="text" 
                  value={generatorData.inputs.catalogue}
                  onChange={(e) => setGeneratorData(p => ({ ...p, inputs: { ...p.inputs, catalogue: e.target.value }}))}
                  className="mt-1 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="VD: Marketing"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Mô tả</label>
                <textarea 
                  value={generatorData.inputs.description}
                  onChange={(e) => setGeneratorData(p => ({ ...p, inputs: { ...p.inputs, description: e.target.value }}))}
                  className="mt-1 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Mô tả ngắn gọn về bài viết..."
                  rows={3}
                />
              </div>
              {generatorData.error && <p className="text-sm text-red-600">{generatorData.error}</p>}
            </div>
            <div className="border-t p-4 flex justify-end flex-shrink-0">
              <button 
                onClick={handleGenerateArticle} 
                disabled={generatorData.isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:bg-gray-400 w-full"
              >
                {generatorData.isLoading ? <FiLoader className="animate-spin mx-auto" /> : 'Bắt đầu tạo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSeoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Phân tích SEO</h3>
              <button onClick={() => setShowSeoModal(false)} className="text-gray-400 hover:text-gray-600">
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
                    <h4 className="text-base font-semibold text-gray-800">Phân tích tổng quan</h4>
                    <div className="mt-2 flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-4xl font-bold text-blue-600">{seoData.report.seo_score}<span className="text-2xl text-gray-400">/100</span></div>
                      <p className="text-sm text-gray-600">{seoData.report.seo_analysis.overall_comment}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-gray-800">Gợi ý cải thiện</h4>
                    <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-gray-700">
                      {seoData.report.seo_analysis.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-gray-800">Nội dung SEO đề xuất</h4>
                    <div className="mt-2 space-y-3 text-sm">
                      <div className="p-3 bg-gray-50 rounded-md">
                        <label className="block font-medium text-gray-600">Meta Title</label>
                        <p className="mt-1 text-gray-900">{seoData.report.generated_seo.meta_title}</p>
                        <button onClick={() => onApplySeo({ meta_title: seoData.report?.generated_seo.meta_title })} className="text-blue-600 hover:underline text-xs mt-1 font-semibold">Áp dụng</button>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <label className="block font-medium text-gray-600">Meta Description</label>
                        <p className="mt-1 text-gray-900">{seoData.report.generated_seo.meta_description}</p>
                        <button onClick={() => onApplySeo({ meta_description: seoData.report?.generated_seo.meta_description })} className="text-blue-600 hover:underline text-xs mt-1 font-semibold">Áp dụng</button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="border-t p-4 flex justify-end">
              <button onClick={() => setShowSeoModal(false)} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogPostPreview;