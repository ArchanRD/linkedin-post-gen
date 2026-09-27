import React, { useState } from 'react';
import { GeneratedPostResponse, UserProfile, PostImageLayout } from '../types';
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
  ChevronLeft,
  ChevronRight,
  Eye,
  Layers,
  Image as ImageIcon
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
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showTextInImageOnly, setShowTextInImageOnly] = useState(false);

  const LAYOUT_DISPLAY_NAMES: Record<PostImageLayout, string> = {
    'text-up-image-below': 'Text Up & Image Below',
    'text-left-image-right': 'Text Left & Image Right',
    'text-right-image-left': 'Text Right & Image Left',
    'image-only': 'Image Only',
    'text-on-image-fullscreen': 'Text on Image Full Screen',
  };

  const layoutTitle = LAYOUT_DISPLAY_NAMES[postData.layout] || postData.layout;

  // Sync if postData changes
  React.useEffect(() => {
    setEditableText(postData.postText);
    setActiveImageIndex(0);
  }, [postData.postText, postData.images]);

  const images = postData.images || [];
  const currentImage = images[activeImageIndex] || images[0] || {
    id: 'placeholder',
    url: '',
    alt: eventName,
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length === 0) return;
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length === 0) return;
    setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

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
    images.forEach((img, idx) => {
      const link = document.createElement('a');
      link.href = img.url;
      link.download = `${eventName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-photo-${idx + 1}.png`;
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

  // Reusable Post Header Component
  const PostAuthorHeader = ({ isLight = false }: { isLight?: boolean }) => (
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
            <h4 className={`text-sm font-bold hover:underline cursor-pointer ${isLight ? 'text-white' : 'text-slate-900'}`}>
              {user.name}
            </h4>
            <span className={`text-[11px] font-normal ${isLight ? 'text-white/60' : 'text-slate-400'}`}>• 1st</span>
          </div>
          <p className={`text-xs line-clamp-1 leading-snug ${isLight ? 'text-white/80' : 'text-slate-500'}`}>
            {user.headline || 'Product & Tech Specialist | Event Attendee'}
          </p>
          <div className={`flex items-center gap-1 text-[11px] mt-0.5 ${isLight ? 'text-white/60' : 'text-slate-400'}`}>
            <span>Just now</span>
            <span>•</span>
            <Globe className="w-3 h-3" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={`p-1.5 rounded-full transition-colors cursor-pointer ${isLight ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100'}`}
          title="Edit Post Text"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button 
          type="button"
          className={`p-1.5 rounded-full transition-colors cursor-pointer ${isLight ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  // Reusable Post Text Body
  const PostTextContent = () => (
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
  );

  // Reusable Social Footer (Likes, Comments, Buttons)
  const PostSocialFooter = ({ isLight = false }: { isLight?: boolean }) => (
    <>
      <div className={`px-4 py-2 border-b flex items-center justify-between text-xs ${isLight ? 'border-white/10 text-white/70' : 'border-slate-100 text-slate-500'}`}>
        <div className="flex items-center gap-1.5">
          <span className="flex -space-x-1">
            <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">👍</span>
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">👏</span>
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">❤️</span>
          </span>
          <span className="hover:underline cursor-pointer">48 reactions</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hover:underline cursor-pointer">8 comments</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">4 reposts</span>
        </div>
      </div>

      <div className={`px-2 py-1 flex items-center justify-around font-semibold text-xs sm:text-sm ${isLight ? 'text-white/80' : 'text-slate-600'}`}>
        <button type="button" className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${isLight ? 'hover:bg-white/10' : 'hover:bg-slate-100 hover:text-blue-600'}`}>
          <ThumbsUp className="w-4 h-4" />
          <span>Like</span>
        </button>
        <button type="button" className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${isLight ? 'hover:bg-white/10' : 'hover:bg-slate-100 hover:text-blue-600'}`}>
          <MessageSquare className="w-4 h-4" />
          <span>Comment</span>
        </button>
        <button type="button" className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${isLight ? 'hover:bg-white/10' : 'hover:bg-slate-100 hover:text-blue-600'}`}>
          <Repeat2 className="w-4 h-4" />
          <span>Repost</span>
        </button>
        <button type="button" className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${isLight ? 'hover:bg-white/10' : 'hover:bg-slate-100 hover:text-blue-600'}`}>
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </div>
    </>
  );

  // 5-Images Carousel & Thumbnail Strip Viewer
  const MultiImageCarousel = ({
    aspectRatioClass = "aspect-video sm:aspect-16/9",
    showThumbnails = true,
  }: {
    aspectRatioClass?: string;
    showThumbnails?: boolean;
  }) => (
    <div className="flex flex-col bg-slate-950 overflow-hidden select-none">
      {/* Active Main Image Container */}
      <div 
        className={`relative group cursor-pointer w-full bg-slate-950 flex items-center justify-center overflow-hidden ${aspectRatioClass}`}
        onClick={() => setActiveImageModal(currentImage.url)}
      >
        <img
          src={currentImage.url}
          alt={currentImage.alt}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-300"
        />

        {/* Carousel Prev Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrevImage}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-xs transition-opacity opacity-85 hover:opacity-100 z-10 cursor-pointer shadow-md"
            title="Previous Photo"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Carousel Next Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNextImage}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-xs transition-opacity opacity-85 hover:opacity-100 z-10 cursor-pointer shadow-md"
            title="Next Photo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Top Badges (Counter & Fullscreen) */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-black/70 text-white text-[11px] font-semibold backdrop-blur-xs shadow-xs pointer-events-auto">
            Photo {activeImageIndex + 1} of {images.length}
          </span>
          <span className="p-1.5 rounded-full bg-black/70 text-white backdrop-blur-xs shadow-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
            <Maximize2 className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Caption Bar */}
        {currentImage.caption && (
          <div className="absolute bottom-2 left-2 right-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 rounded-lg text-[11px] text-white/90">
            <span className="font-semibold text-blue-300 mr-1.5">●</span>
            {currentImage.caption}
          </div>
        )}
      </div>

      {/* 5-Images Thumbnail Bar */}
      {showThumbnails && images.length > 1 && (
        <div className="p-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-1.5 overflow-x-auto">
          <div className="flex items-center gap-1.5 w-full justify-between">
            {images.map((img, idx) => {
              const isActive = idx === activeImageIndex;
              return (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative flex-1 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-blue-500 scale-102 ring-2 ring-blue-500/40'
                      : 'border-transparent opacity-60 hover:opacity-100 hover:border-slate-500'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0.5 right-1 text-[9px] font-bold text-white bg-black/60 px-1 rounded">
                    {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Top Banner Bar with Quick Action Buttons */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-blue-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/25 text-blue-300 text-[11px] font-semibold border border-blue-400/30">
              <Sparkles className="w-3 h-3 text-blue-300" />
              Copy: Gemini 3.8 Flash
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/25 text-amber-300 text-[11px] font-semibold border border-amber-400/30">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Images: {postData.imageModelUsed || 'Gemini Nano Banana'} (5 Assets)
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold">
            Your LinkedIn Event Post is Ready
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Layout: <span className="font-semibold text-blue-300">{layoutTitle}</span> • 5 distinct perspective images synthesized
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
            {downloadSuccess ? 'Downloaded!' : `Download All 5 Images`}
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

      {/* ============================================================== */}
      {/* 5 SINGLE POST LAYOUT DESIGNS                                    */}
      {/* ============================================================== */}

      {/* LAYOUT 1: TEXT UP & IMAGE BELOW (Classic LinkedIn Feed) */}
      {postData.layout === 'text-up-image-below' && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
          <PostAuthorHeader />
          <PostTextContent />
          <MultiImageCarousel aspectRatioClass="aspect-video sm:aspect-16/9" showThumbnails={true} />
          <PostSocialFooter />
        </div>
      )}

      {/* LAYOUT 2: TEXT LEFT & IMAGE RIGHT (Side-by-Side Split Card) */}
      {postData.layout === 'text-left-image-right' && (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {/* Left Column: Author, Text & Actions */}
            <div className="md:col-span-6 flex flex-col justify-between">
              <div>
                <PostAuthorHeader />
                <PostTextContent />
              </div>
              <PostSocialFooter />
            </div>

            {/* Right Column: 5-Images Carousel */}
            <div className="md:col-span-6 bg-slate-950 flex flex-col justify-center">
              <MultiImageCarousel aspectRatioClass="aspect-square sm:aspect-4/3 md:h-full" showThumbnails={true} />
            </div>
          </div>
        </div>
      )}

      {/* LAYOUT 3: TEXT RIGHT & IMAGE LEFT (Visual-First Split Card) */}
      {postData.layout === 'text-right-image-left' && (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {/* Left Column: 5-Images Carousel */}
            <div className="md:col-span-6 bg-slate-950 flex flex-col justify-center order-2 md:order-1">
              <MultiImageCarousel aspectRatioClass="aspect-square sm:aspect-4/3 md:h-full" showThumbnails={true} />
            </div>

            {/* Right Column: Author, Text & Actions */}
            <div className="md:col-span-6 flex flex-col justify-between order-1 md:order-2">
              <div>
                <PostAuthorHeader />
                <PostTextContent />
              </div>
              <PostSocialFooter />
            </div>
          </div>
        </div>
      )}

      {/* LAYOUT 4: IMAGE ONLY (Visual Showcase Card with Expandable Caption) */}
      {postData.layout === 'image-only' && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
          <div className="p-4 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3">
              <img
                src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900">{user.name}</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="font-semibold text-blue-600">Visual Event Reel (5 Photos)</span>
                  <span>•</span>
                  <span>Just now</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowTextInImageOnly(!showTextInImageOnly)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showTextInImageOnly ? 'Hide Caption' : 'Show Caption'}</span>
            </button>
          </div>

          {/* Main Visual Slider (Image-dominant) */}
          <MultiImageCarousel aspectRatioClass="aspect-square sm:aspect-16/9" showThumbnails={true} />

          {/* Expandable Caption Drawer */}
          {showTextInImageOnly && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 animate-fadeIn">
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Full Post Copy &amp; Tags
              </h5>
              <PostTextContent />
            </div>
          )}

          <PostSocialFooter />
        </div>
      )}

      {/* LAYOUT 5: TEXT ON IMAGE FULL SCREEN (Cinematic Overlay Poster Card) */}
      {postData.layout === 'text-on-image-fullscreen' && (
        <div className="max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-xl border border-slate-800 relative bg-slate-950 font-sans text-white">
          {/* Background Image with Dark Vignette Overlay */}
          <div className="relative min-h-[580px] flex flex-col justify-between p-6 sm:p-8">
            <img
              src={currentImage.url}
              alt={currentImage.alt}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover filter brightness-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40"></div>

            {/* Top Author Tag on Glassmorphic Pill */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-3 p-1.5 pr-4 rounded-full bg-black/40 backdrop-blur-md border border-white/15">
                <img
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-white/20"
                />
                <div className="text-left">
                  <div className="text-xs font-bold text-white">{user.name}</div>
                  <div className="text-[10px] text-blue-300 font-medium">Verified Attendee</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-600/80 text-white backdrop-blur-xs border border-blue-400/30">
                  Photo {activeImageIndex + 1} of {images.length}
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/10 cursor-pointer"
                  title="Edit Text"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Center: Overlaid Post Hook & Key Takeaways */}
            <div className="relative z-10 py-6 space-y-4">
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={editableText}
                    onChange={(e) => setEditableText(e.target.value)}
                    rows={8}
                    className="w-full text-sm text-white bg-black/60 p-3 rounded-xl border border-blue-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 leading-relaxed font-sans backdrop-blur-md"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg shadow-xs cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="inline-block px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
                    {eventName}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">
                    {postData.headlineHook || editableText.split('\n')[0]}
                  </h2>

                  {/* Highlights pills */}
                  <div className="space-y-2 pt-1">
                    {postData.keyTakeaways && postData.keyTakeaways.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-black/45 backdrop-blur-md border border-white/10 text-xs sm:text-sm text-slate-200 flex items-start gap-2.5 shadow-sm"
                      >
                        <span className="w-5 h-5 rounded-full bg-blue-600/80 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Hashtags Overlaid */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {postData.hashtags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-xs text-blue-300 border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Bottom: Background Photo Switcher Toolbar (All 5 Photos) */}
            <div className="relative z-10 pt-4 border-t border-white/15">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  Select Background Photo (5 Generated)
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {images.map((img, idx) => {
                  const isActive = idx === activeImageIndex;
                  return (
                    <button
                      key={img.id || idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        isActive
                          ? 'border-blue-400 scale-102 ring-2 ring-blue-500/50 shadow-md'
                          : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/50'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0.5 right-1 text-[9px] font-bold text-white bg-black/70 px-1 rounded">
                        {idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <PostSocialFooter isLight={true} />
        </div>
      )}

      {/* Image Lightbox Modal */}
      {activeImageModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
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
              Download All 5 Images
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
