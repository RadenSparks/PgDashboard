import  { useState, useRef } from 'react';
import MediaPicker from "../../media/MediaPicker";
import type { MediaItem } from '../../../redux/api/mediaApi';

// Định nghĩa các chiến dịch bạn có
const customerCampaigns = [
  { id: 'vip_promo', name: 'Gửi cho Khách hàng VIP' },
  { id: 'anniversary_all', name: 'Gửi cho TẤT CẢ Khách hàng (Kỷ niệm)' },
];

const EmailSender = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  // State mới để lưu URL ảnh banner
  const [bannerUrl, setBannerUrl] = useState<string>(''); 
  // State cho nội dung Markdown
  const [emailBody, setEmailBody] = useState<string>(''); 
  const [status, setStatus] = useState({ message: '', type: '' });
  const [showMediaPicker, setShowMediaPicker] = useState<"banner" | "insert" | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCreateCampaign = async () => {
    if (!selectedCampaign) {
      setStatus({ message: 'Vui lòng chọn một nhóm khách hàng.', type: 'error' });
      return;
    }
    if (!emailSubject.trim() || !emailBody.trim()) {
      setStatus({ message: 'Vui lòng nhập Tiêu đề và Nội dung email.', type: 'error' });
      return;
    }

    setStatus({ message: 'Đang gửi yêu cầu...', type: 'loading' });

    // **Chuyển markdown thành HTML và xây dựng email hoàn chỉnh**
    const htmlContent = markdownToHtml(emailBody);
    const fullHtmlBody = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${emailSubject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    ${bannerUrl ? `
                    <tr>
                        <td style="padding: 0;">
                            <img src="${bannerUrl}" alt="Email Banner" style="width: 100%; height: auto; display: block; border-radius: 8px 8px 0 0;"/>
                        </td>
                    </tr>
                    ` : ''}
                    <tr>
                        <td style="padding: 30px;">
                            <div style="font-size: 16px; line-height: 1.6; color: #333333;">
                                ${htmlContent}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
                            <p style="margin: 0; font-size: 14px; color: #666666;">
                                Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    const N8N_WEBHOOK_URL = 'https://103226109.flown8n.com/webhook-test/45ea06ab-70ff-413c-9464-f07e8e8652ad';

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_type: selectedCampaign,
          email_subject: emailSubject,
          email_body: fullHtmlBody, // Gửi nội dung HTML đã bao gồm cả ảnh
          content_type: 'text/html', // Chỉ định rõ đây là HTML content
          is_html: true, // Flag để n8n biết đây là HTML
        }),
      });

      if (!response.ok) throw new Error('Phản hồi từ server không thành công.');
      
      const result = await response.json();
      
      if (result.status === 'success') {
        setStatus({ message: 'Đã gửi yêu cầu! Workflow đang chạy ngầm.', type: 'success' });
      } else {
        throw new Error('Server báo lỗi.');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
      setStatus({ message: `Gửi yêu cầu thất bại: ${errorMessage}`, type: 'error' });
    }
  };

  // Markdown helpers
  const insertMarkdown = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = emailBody.slice(start, end) || '';
    const beforeText = emailBody.slice(0, start) || '';
    const afterText = emailBody.slice(end) || '';
    const insertText = selected || placeholder;
    const newContent = beforeText + before + insertText + after + afterText;
    setEmailBody(newContent);
    setTimeout(() => {
      if (document.activeElement === textarea) {
        if (selected) {
          textarea.selectionStart = start + before.length;
          textarea.selectionEnd = start + before.length + insertText.length;
        } else {
          textarea.selectionStart = textarea.selectionEnd = start + before.length + insertText.length + after.length;
        }
      }
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

  // Convert markdown to HTML
  const markdownToHtml = (markdown: string) => {
    if (!markdown || markdown.trim() === '') return '';
    
    // Chỉ chuyển đổi cú pháp Markdown, giữ nguyên các biến {{...}}
    let html = markdown
      .replace(/^### (.*$)/gm, '<h3 style="color: #1e40af; margin: 20px 0 10px 0;">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 style="color: #1e40af; margin: 25px 0 15px 0;">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 style="color: #1e40af; margin: 30px 0 20px 0;">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width: 100%;" />')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      .replace(/^---$/gm, '<hr />')
      .replace(/\n\s*\n/g, '</p><p>')
      .replace(/\n/g, '<br />');

    // Logic dọn dẹp và bao bọc thẻ <p>
    if (!html.startsWith('<h') && !html.startsWith('<hr') && !html.startsWith('<img')) {
      html = `<p>${html}</p>`;
    }
    html = html.replace(/<p><\/p>/g, '');
    
    return html;
  };

  return (
    <div className="p-8 border rounded-lg max-w-2xl mx-auto bg-white shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Tạo Chiến Dịch Email Chuyên Nghiệp</h2>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="campaign-select" className="block text-sm font-semibold text-gray-800 mb-3">
            1. Chọn nhóm khách hàng:
          </label>
          <div className="relative">
            <select 
              id="campaign-select" 
              value={selectedCampaign} 
              onChange={(e) => setSelectedCampaign(e.target.value)} 
              className="w-full p-4 pr-12 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 font-medium text-lg focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 appearance-none cursor-pointer hover:border-blue-300 hover:shadow-md"
            >
              <option value="" disabled className="text-gray-500">🎯 Chọn đối tượng khách hàng...</option>
              {customerCampaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id} className="text-gray-800 font-medium py-2">
                  {campaign.id === 'vip_promo' ? '👑' : '🎉'} {campaign.name}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {selectedCampaign && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✅</span>
                <span className="text-sm font-medium text-green-800">
                  Đã chọn: {customerCampaigns.find(c => c.id === selectedCampaign)?.name}
                </span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="email-subject" className="block text-sm font-medium text-gray-700 mb-1">
            2. Nhập tiêu đề email:
          </label>
          <input type="text" id="email-subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="VD: Ưu đãi đặc biệt dành cho khách hàng VIP!" className="w-full p-2 border border-gray-300 rounded-md"/>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            3. (Tùy chọn) Ảnh banner:
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="bg-blue-100 text-blue-700 rounded-lg px-4 py-2 hover:bg-blue-200 text-sm font-medium"
              onClick={() => setShowMediaPicker("banner")}
            >
              {bannerUrl ? "Thay đổi Banner" : "Chọn từ thư viện"}
            </button>
            {bannerUrl && (
              <button
                type="button"
                className="bg-gray-200 text-gray-600 rounded-lg px-3 py-2 hover:bg-gray-300 text-sm"
                onClick={() => setBannerUrl('')}
              >
                Xóa
              </button>
            )}
          </div>
          {bannerUrl && (
            <img
              src={bannerUrl}
              alt="Banner"
              className="w-32 h-20 object-cover rounded-lg mt-2 border"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            4. Soạn nội dung email (Markdown):
          </label>
          
          {/* Markdown Toolbar */}
          <div className="border border-gray-300 rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-2">
            <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100" onClick={() => handleInsertHeading(1)}>H1</button>
            <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100" onClick={() => handleInsertHeading(2)}>H2</button>
            <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100" onClick={() => handleInsertHeading(3)}>H3</button>
            <span className="border-l mx-1"></span>
            <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100 font-bold" onClick={handleInsertBold}>B</button>
            <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100 italic" onClick={handleInsertItalic}>I</button>
            <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100 underline" onClick={handleInsertUnderline}>U</button>
            <span className="border-l mx-1"></span>
            <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100" onClick={handleInsertImage}>🖼️ Ảnh</button>
            <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100" onClick={handleInsertHr}>―</button>
            <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100" onClick={handleParagraphBreak}>¶</button>
          </div>
          
          {/* Markdown Editor */}
          <textarea
            ref={textareaRef}
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            placeholder="Viết nội dung email bằng Markdown...\n\nVí dụ:\n# Tiêu đề lớn\n## Tiêu đề nhỏ\n**Chữ đậm** và _chữ nghiêng_\n\n- Danh sách\n- Mục 2"
            className="w-full h-64 p-3 border-x border-b border-gray-300 rounded-b-md font-mono text-sm resize-vertical"
            style={{ minHeight: '200px' }}
          />
          
          {/* Gallery Images */}
          {galleryImages.length > 0 && (
            <div className="mt-3 p-3 border rounded-md bg-gray-50">
              <div className="text-sm font-medium mb-2">Ảnh đã chọn:</div>
              <div className="flex gap-2 flex-wrap">
                {galleryImages.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img src={img} alt={`Gallery ${idx + 1}`} className="w-16 h-16 object-cover rounded border" />
                    <button
                      type="button"
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600"
                      onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== idx))}
                    >
                      ×
                    </button>
                    <button
                      type="button"
                      className="absolute bottom-0 left-0 bg-blue-600 text-white text-xs px-1 py-0.5 rounded-tr opacity-80 hover:opacity-100"
                      onClick={() => insertMarkdown(`\n\n![](${img})\n\n`)}
                    >
                      Chèn
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <p className="text-xs text-gray-500 mt-1">
            <strong>Mẹo:</strong> Dùng <code className="bg-gray-100 px-1 rounded">{`{{ full_name }}`}</code> để cá nhân hóa tên.<br/>
            <strong>Markdown:</strong> <code className="bg-gray-100 px-1 rounded">**đậm**</code>, <code className="bg-gray-100 px-1 rounded">_nghiêng_</code>, <code className="bg-gray-100 px-1 rounded"># tiêu đề</code>
          </p>
        </div>
      </div>
      
      <button onClick={handleCreateCampaign} disabled={status.type === 'loading'} className="w-full mt-8 bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-all">
        {status.type === 'loading' ? 'Đang xử lý...' : '🚀 Tạo và Gửi Chiến Dịch'}
      </button>
      
      {status.message && ( <p className={`mt-4 text-sm text-center ${ status.type === 'error' ? 'text-red-600' : 'text-green-600' }`}>{status.message}</p> )}
      
      {/* MediaPicker Modal */}
      <MediaPicker
        show={!!showMediaPicker}
        multiple={showMediaPicker === "insert"}
        onSelect={(imgs: MediaItem[] | MediaItem) => {
          if (showMediaPicker === "banner") {
            const img = Array.isArray(imgs) ? imgs[0] : imgs;
            setBannerUrl(img.url);
          } else if (showMediaPicker === "insert") {
            const arr = Array.isArray(imgs) ? imgs : [imgs];
            arr.forEach(img => {
              insertMarkdown(`\n\n![](${img.url})\n\n`);
            });
            setGalleryImages(prev => [...prev, ...arr.map(i => i.url)]);
          }
          setShowMediaPicker(null);
        }}
        onClose={() => setShowMediaPicker(null)}
      />
    </div>
  );
};

export default EmailSender;