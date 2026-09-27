import React, { useState } from 'react';
import { GeneratedPostResponse, UserProfile } from '../types';
import { 
  ThumbsUp, 
  MessageSquare, 
  Repeat2, 
  Send, 
  Globe, 
  MoreHorizontal, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Edit3, 
  Save, 
  Maximize2, 
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface LinkedInPostPreviewProps {
  postData: GeneratedPostResponse;
  user: UserProfile;
  eventName: string;
  communityName: string;
  onUpdatePostText?: (newText: string) => void;
}

export const LinkedInPostPreview: React.FC<LinkedInPostPreviewProps> = ({
  postData,
  user,
  eventName,
  communityName,
  onUpdatePostText,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState(postData.postText);
  const [activeImageModal, setActiveImageModal] = useState<string | null>(null);
  const [showPostingGuide, setShowPostingGuide] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Sync if postData changes
  React.useEffect(() => {
    setEditableText(postData.postText);
  }, [postData.postText]);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(editableText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    if (onUpdatePostText) {
      onUpdatePostText(editableText);
    }
  };

  const handleDownloadImages = () => {
    postData.images.forEach((img, idx) => {
      const link = document.createElement('a');
      link.href = img.url;
      link.download = `${eventName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-image-${idx + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleDownloadTextFile = () => {
    const element = document.createElement('a');
    const file = new Blob([editableText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${eventName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-linkedin-post.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleOpenLinkedIn = async () => {
    // Automatically copy text to clipboard for smooth paste
    try {
      await navigator.clipboard.writeText(editableText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Ignore
    }

    setShowPostingGuide(true);
    const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(editableText)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Bar with Quick Action Buttons */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-blue-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-1 border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            Gemini AI Generated • LinkedIn Ready
          </div>
          <h3 className="text-base sm:text-lg font-bold">
            Your LinkedIn Event Post is Ready
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Review the realistic preview below. Edit the text, download visual assets, and post directly to LinkedIn.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            type="button"
            onClick={handleCopyText}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/10 active:scale-95 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Post!' : 'Copy Text'}
          </button>

          <button
            type="button"
            onClick={handleDownloadImages}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/10 active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {downloadSuccess ? 'Downloaded!' : `Download ${postData.images.length} Image${postData.images.length > 1 ? 's' : ''}`}
          </button>

          <button
            type="button"
            onClick={handleOpenLinkedIn}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            Post to LinkedIn
          </button>
        </div>
      </div>

      {/* Posting Guide Modal / Banner when user clicks Post to LinkedIn */}
      {showPostingGuide && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-start justify-between gap-3 animate-fadeIn">
          <div className="space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-emerald-800">
              <Check className="w-4 h-4 text-emerald-600" /> Post text copied to your clipboard!
            </p>
            <p className="text-emerald-700 leading-relaxed">
              LinkedIn opened in a new tab. Simply paste (Ctrl+V or ⌘+V) your post text and attach your downloaded event visual images.
            </p>
          </div>
          <button 
            type="button" 
            onClick={() => setShowPostingGuide(false)}
            className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Realistic LinkedIn Post Container */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
        {/* Post Author Header */}
        <div className="p-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-slate-900 hover:underline cursor-pointer">
                  {user.name}
                </h4>
                <span className="text-[11px] text-slate-400 font-normal">• 1st</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1 leading-snug">
                {user.headline || 'Product & Tech Specialist | Event Attendee'}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                <span>Just now</span>
                <span>•</span>
                <Globe className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title="Edit Post Text"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button 
              type="button"
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Post Text Content */}
        <div className="px-4 pb-3">
          {isEditing ? (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Edit LinkedIn Post Copy
              </label>
              <textarea
                value={editableText}
                onChange={(e) => setEditableText(e.target.value)}
                rows={9}
                className="w-full text-sm text-slate-800 p-3 rounded-xl border border-blue-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 leading-relaxed font-sans"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditableText(postData.postText);
                    setIsEditing(false);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-900 whitespace-pre-line leading-relaxed space-y-2 break-words">
              {editableText.split('\n').map((line, idx) => {
                // Highlight hashtags in blue
                if (line.includes('#')) {
                  const parts = line.split(/(#[a-zA-Z0-9_]+)/g);
                  return (
                    <p key={idx} className="leading-relaxed">
                      {parts.map((p, pIdx) =>
                        p.startsWith('#') ? (
                          <span key={pIdx} className="text-[#0a66c2] font-semibold hover:underline cursor-pointer">
                            {p}{' '}
                          </span>
                        ) : (
                          p
                        )
                      )}
                    </p>
                  );
                }
                return (
                  <p key={idx} className="leading-relaxed">
                    {line}
                  </p>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Image Layout Display */}
        <div className="bg-slate-900/90 relative overflow-hidden select-none">
          {/* Layout: Single Hero (1 image) */}
          {postData.layout === 'single-hero' && postData.images.length >= 1 && (
            <div 
              className="relative group cursor-pointer aspect-video sm:aspect-16/9 bg-slate-950 flex items-center justify-center overflow-hidden"
              onClick={() => setActiveImageModal(postData.images[0].url)}
            >
              <img
                src={postData.images[0].url}
                alt={postData.images[0].alt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="p-2 rounded-full bg-black/60 text-white backdrop-blur-xs">
                  <Maximize2 className="w-4 h-4" />
                </span>
              </div>
            </div>
          )}

          {/* Layout: Dual Split (2 images) */}
          {postData.layout === 'dual-split' && (
            <div className="grid grid-cols-2 gap-1 bg-slate-950">
              {postData.images.slice(0, 2).map((img, idx) => (
                <div
                  key={img.id || idx}
                  className="relative group cursor-pointer aspect-square overflow-hidden bg-slate-900"
                  onClick={() => setActiveImageModal(img.url)}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="p-2 rounded-full bg-black/60 text-white backdrop-blur-xs">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Layout: Triptych Grid (3 images: 1 big + 2 stacked) */}
          {postData.layout === 'triptych-grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 bg-slate-950">
              {/* Left big image */}
              {postData.images[0] && (
                <div
                  className="relative group cursor-pointer h-64 sm:h-80 overflow-hidden bg-slate-900"
                  onClick={() => setActiveImageModal(postData.images[0].url)}
                >
                  <img
                    src={postData.images[0].url}
                    alt={postData.images[0].alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="p-2 rounded-full bg-black/60 text-white backdrop-blur-xs">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              )}

              {/* Right stacked two images */}
              <div className="grid grid-rows-2 gap-1 h-64 sm:h-80">
                {postData.images.slice(1, 3).map((img, idx) => (
                  <div
                    key={img.id || idx}
                    className="relative group cursor-pointer overflow-hidden bg-slate-900"
                    onClick={() => setActiveImageModal(img.url)}
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="p-1.5 rounded-full bg-black/60 text-white backdrop-blur-xs">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Layout: Quad Mosaic (4 images 2x2) */}
          {postData.layout === 'quad-mosaic' && (
            <div className="grid grid-cols-2 gap-1 bg-slate-950">
              {postData.images.slice(0, 4).map((img, idx) => (
                <div
                  key={img.id || idx}
                  className="relative group cursor-pointer aspect-square sm:aspect-4/3 overflow-hidden bg-slate-900"
                  onClick={() => setActiveImageModal(img.url)}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="p-1.5 rounded-full bg-black/60 text-white backdrop-blur-xs">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LinkedIn Social Counters */}
        <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="flex -space-x-1">
              <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">👍</span>
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">👏</span>
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">❤️</span>
            </span>
            <span className="hover:text-blue-600 cursor-pointer">42 reactions</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hover:text-blue-600 cursor-pointer">5 comments</span>
            <span>•</span>
            <span className="hover:text-blue-600 cursor-pointer">3 reposts</span>
          </div>
        </div>

        {/* LinkedIn Interactive Action Buttons Bar */}
        <div className="px-2 py-1 flex items-center justify-around text-slate-600 font-semibold text-xs sm:text-sm">
          <button 
            type="button"
            className="flex items-center gap-1.5 px-3 py-2.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-slate-600 hover:text-blue-600"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>Like</span>
          </button>
          <button 
            type="button"
            className="flex items-center gap-1.5 px-3 py-2.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-slate-600 hover:text-blue-600"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Comment</span>
          </button>
          <button 
            type="button"
            className="flex items-center gap-1.5 px-3 py-2.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-slate-600 hover:text-blue-600"
          >
            <Repeat2 className="w-4 h-4" />
            <span>Repost</span>
          </button>
          <button 
            type="button"
            className="flex items-center gap-1.5 px-3 py-2.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-slate-600 hover:text-blue-600"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {activeImageModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveImageModal(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-black" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActiveImageModal(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={activeImageModal}
              alt="Enlarged Post Visual"
              referrerPolicy="no-referrer"
              className="w-full h-auto max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}

      {/* Bottom Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <button
          type="button"
          onClick={handleCopyText}
          className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-left flex items-start gap-3 group cursor-pointer shadow-2xs active:scale-[0.99]"
        >
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {copied ? 'Copied to Clipboard' : 'Copy Post Text'}
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Instant clipboard copy with formatting and hashtags.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={handleDownloadImages}
          className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-left flex items-start gap-3 group cursor-pointer shadow-2xs active:scale-[0.99]"
        >
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              Download All Images
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Saves high-res generated visuals for this layout.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={handleDownloadTextFile}
          className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-left flex items-start gap-3 group cursor-pointer shadow-2xs active:scale-[0.99]"
        >
          <div className="p-2 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-slate-800 group-hover:text-white transition-colors">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
              Save as .txt File
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Backup post draft and tags for later scheduling.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
