import React, { useState, useEffect } from 'react';
import { EventItem, UserProfile, PostImageLayout, PostTone, GeneratedPostResponse } from '../types';
import { LayoutSelector } from './LayoutSelector';
import { LinkedInPostPreview } from './LinkedInPostPreview';
import { api } from '../services/api';
import { 
  Calendar, 
  Building, 
  Link2, 
  ArrowLeft, 
  Sparkles, 
  FileText, 
  Share2, 
  CheckCircle2, 
  Users, 
  Check, 
  ExternalLink,
  MessageSquare,
  Clock,
  Send,
  Loader2,
  RefreshCw,
  Sliders,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface AttendeeViewProps {
  events: EventItem[];
  user: UserProfile;
  onRefreshEvents: () => void;
  initialSelectedEventId?: string | null;
}

export const AttendeeView: React.FC<AttendeeViewProps> = ({
  events,
  user,
  onRefreshEvents,
  initialSelectedEventId,
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(initialSelectedEventId || null);
  const [activeTab, setActiveTab] = useState<'brief' | 'generator'>('brief');
  const [selectedLayout, setSelectedLayout] = useState<PostImageLayout | null>('text-up-image-below');
  const [selectedTone, setSelectedTone] = useState<PostTone>('Enthusiastic & Inspiring');
  const [attendeeNotes, setAttendeeNotes] = useState('');
  const [customPrompt, setCustomPrompt] = useState(
    "Write an authentic, punchy first-person post about today's sessions. Include 3 specific takeaways, thank the host community, and ask readers for their experience with agent architectures. Keep sentences short, engaging, and free of generic corporate buzzwords."
  );
  // Dedicated prompt for Nano Banana Image Generation
  const [imagePrompt, setImagePrompt] = useState(
    "A high-end cinematic photo of a modern tech convention keynote mainstage with vibrant neon lighting, an inspiring speaker at the podium, and an engaged audience in the auditorium, 8k editorial photography, photorealistic, sharp focus."
  );
  
  // Generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegeneratingContent, setIsRegeneratingContent] = useState(false);
  const [isRegeneratingImages, setIsRegeneratingImages] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<'idle' | 'generating' | 'complete'>('idle');
  const [generatedPost, setGeneratedPost] = useState<GeneratedPostResponse | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [registeringEventId, setRegisteringEventId] = useState<string | null>(null);

  // Quick Content Prompt Recipe Templates (Gemini 3.8 Flash)
  const PROMPT_RECIPES = [
    {
      label: '🚀 Contrarian Hot Take',
      prompt: 'Write a bold, provocative hook questioning current AI industry complexity. Share 3 sharp realizations on why practical autonomous execution beats bloated architectures. End by asking readers if they agree or disagree.',
    },
    {
      label: '💡 3 Actionable Frameworks',
      prompt: 'Break down 3 tangible engineering principles learned from today\'s keynote speakers. Keep each point crisp, practical, and devoid of corporate clichés. Conclude with a question on modern stacks.',
    },
    {
      label: '🤝 Community & Gratitude',
      prompt: 'Focus warmly on the authentic energy of the community and the high-caliber builders in attendance. Give a sincere shoutout to the organizing team and speakers, inviting folks to connect.',
    },
    {
      label: '🎯 Executive Summary',
      prompt: 'Draft an executive briefing for tech leads: highlight macro industry direction, deployment velocity, and key operational takeaways in clear bullet points.',
    },
  ];

  // Quick Image Generation Presets (Gemini Nano Banana Model)
  const IMAGE_PROMPT_RECIPES = [
    {
      label: '📸 Keynote Mainstage & Crowd',
      prompt: 'Wide cinematic master photo of the keynote mainstage with vibrant neon blue and amber stage lighting, an engaging speaker at the podium, and an attentive tech audience in the auditorium, 8k editorial photography, photorealistic.',
    },
    {
      label: '🎙️ Speaker Spotlight & Bokeh',
      prompt: 'Dynamic close-up portrait of the keynote speaker presenting with a handheld microphone, warm cinematic bokeh background with event visual displays, sharp focus, natural lighting.',
    },
    {
      label: '👥 Peer Networking Lounge',
      prompt: 'Engaging modern convention networking lounge with diverse tech professionals in thoughtful discussion holding coffee cups, warm ambient venue interior, documentary style.',
    },
    {
      label: '💻 Hands-on Coding Lab',
      prompt: 'Interactive developer lab and coding workshop with attendees collaborating around open laptops with code on screens, interactive classroom environment, sharp vivid colors.',
    },
    {
      label: '🌐 Futuristic Tech Expo',
      prompt: 'Expansive high-tech exhibition floor with glowing demo booths, modern digital displays, and curious attendees discovering software showcases, cinematic wide-angle.',
    },
  ];

  // Set initial selected event if provided
  useEffect(() => {
    if (initialSelectedEventId) {
      setSelectedEventId(initialSelectedEventId);
    }
  }, [initialSelectedEventId]);

  // Find currently active event
  const currentEvent = events.find((e) => e.id === selectedEventId);

  // Registered events for this user email
  const userRegisteredEvents = events.filter((e) =>
    e.registeredAttendees?.some((a) => a.email.toLowerCase() === user.email.toLowerCase())
  );

  // Other community events
  const otherEvents = events.filter((e) =>
    !e.registeredAttendees?.some((a) => a.email.toLowerCase() === user.email.toLowerCase())
  );

  // One-click quick registration from Attendee dashboard
  const handleQuickRegister = async (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setRegisteringEventId(eventId);
      await api.registerForEvent(eventId, user.email);
      onRefreshEvents();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setRegisteringEventId(null);
    }
  };

  // Trigger Parallel Post Generation (Content + Images)
  const handleGeneratePost = async () => {
    if (!currentEvent || !selectedLayout) return;

    try {
      setIsGenerating(true);
      setGenerationError(null);
      setGenerationProgress('generating');

      const response = await api.generateFullPost({
        eventId: currentEvent.id,
        eventName: currentEvent.name,
        communityName: currentEvent.communityName,
        communitySocialLink: currentEvent.communitySocialLink,
        date: currentEvent.date,
        description: currentEvent.description,
        keyTakeaways: currentEvent.keyTakeaways,
        attendeeNotes: attendeeNotes.trim(),
        customPrompt: customPrompt.trim(),
        imagePrompt: imagePrompt.trim(),
        tone: selectedTone,
        layout: selectedLayout,
        userName: user.name,
        userHeadline: user.headline,
      });

      setGeneratedPost(response);
      setGenerationProgress('complete');
    } catch (err) {
      setGenerationError((err as Error).message || 'Failed to generate post. Please retry.');
      setGenerationProgress('idle');
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate only the post copy using Gemini 3.8 Flash
  const handleRegenerateContentOnly = async () => {
    if (!currentEvent || !generatedPost) return;
    try {
      setIsRegeneratingContent(true);
      const res = await api.generatePostContentOnly({
        eventName: currentEvent.name,
        communityName: currentEvent.communityName,
        communitySocialLink: currentEvent.communitySocialLink,
        date: currentEvent.date,
        description: currentEvent.description,
        keyTakeaways: currentEvent.keyTakeaways,
        attendeeNotes: attendeeNotes.trim(),
        customPrompt: customPrompt.trim(),
        tone: selectedTone,
        userName: user.name,
        userHeadline: user.headline,
      });
      setGeneratedPost((prev) => prev ? {
        ...prev,
        postText: res.postText,
        headlineHook: res.headlineHook,
        keyTakeaways: res.keyTakeaways,
        hashtags: res.hashtags,
        contentPrompt: customPrompt.trim(),
      } : null);
    } catch (err) {
      alert('Content regeneration failed: ' + (err as Error).message);
    } finally {
      setIsRegeneratingContent(false);
    }
  };

  // Regenerate only the 5 images using Gemini Nano Banana
  const handleRegenerateImagesOnly = async () => {
    if (!currentEvent || !generatedPost || !selectedLayout) return;
    try {
      setIsRegeneratingImages(true);
      const res = await api.generatePostImagesOnly({
        eventName: currentEvent.name,
        communityName: currentEvent.communityName,
        layout: selectedLayout,
        description: currentEvent.description,
        imagePrompt: imagePrompt.trim(),
      });
      setGeneratedPost((prev) => prev ? {
        ...prev,
        images: res.images,
        imagePrompt: imagePrompt.trim(),
        imageModelUsed: res.images[0]?.modelUsed || 'Gemini Nano Banana',
      } : null);
    } catch (err) {
      alert('Image regeneration failed: ' + (err as Error).message);
    } finally {
      setIsRegeneratingImages(false);
    }
  };

  // Tone Options
  const TONE_OPTIONS: { id: PostTone; label: string; desc: string }[] = [
    { id: 'Enthusiastic & Inspiring', label: 'Enthusiastic & Inspiring', desc: 'High energy, visionary, celebrates community wins' },
    { id: 'Thought Leadership', label: 'Thought Leadership', desc: 'Analytical, frameworks, strategic insights' },
    { id: 'Crisp & Professional', label: 'Crisp & Professional', desc: 'Direct, clear takeaways, structured executive summary' },
    { id: 'Storyteller & Reflective', label: 'Storyteller & Reflective', desc: 'Personal narrative, emotional hook, behind-the-scenes' },
    { id: 'Community & Networking', label: 'Community & Networking', desc: 'Tags peers, warm gratitude, invites connections' },
  ];

  // -------------------------------------------------------------
  // VIEW 1: EVENTS LISTING VIEW (When no event is opened)
  // -------------------------------------------------------------
  if (!currentEvent) {
    return (
      <div className="space-y-8 pb-16">
        {/* Welcome Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Attendee Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Events &amp; LinkedIn Generator
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Signed in as <span className="font-semibold text-slate-800">{user.email}</span>. Click any registered event to view its brief and generate a customized LinkedIn post with Gemini AI.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700">
              {userRegisteredEvents.length} Registered {userRegisteredEvents.length === 1 ? 'Event' : 'Events'}
            </span>
          </div>
        </div>

        {/* Section 1: Registered Events */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Your Registered Events ({userRegisteredEvents.length})
              </h2>
              <p className="text-xs text-slate-500">
                Events linked to your Google email. Click into any event to generate your post.
              </p>
            </div>
          </div>

          {userRegisteredEvents.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-300">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No registered events yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                You haven&apos;t registered for any events with {user.email}. Register for one below or use a public event registration form!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {userRegisteredEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => {
                    setSelectedEventId(event.id);
                    setActiveTab('brief');
                    setGeneratedPost(null);
                  }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer p-5 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-100">
                        <Check className="w-3 h-3 stroke-[3]" />
                        Registered
                      </span>

                      <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {event.date}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {event.name}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium pt-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{event.communityName}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-blue-600 font-bold group-hover:underline flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Generate LinkedIn Post
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Explore Other Events to Join */}
        {otherEvents.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Explore More Community Events
              </h2>
              <p className="text-xs text-slate-500">
                Register with one click to add these events to your workspace and generate post briefs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {otherEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white/80 rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">{event.communityName}</span>
                      <span>{event.date}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {event.name}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={registeringEventId === event.id}
                    onClick={(e) => handleQuickRegister(event.id, e)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {registeringEventId === event.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>Register with {user.email}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: INSIDE AN EVENT DETAIL (Brief & Post Generator Tabs)
  // -------------------------------------------------------------
  return (
    <div className="space-y-6 pb-20">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            setSelectedEventId(null);
            setGeneratedPost(null);
          }}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events List
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Attendee:</span>
          <span className="font-semibold text-slate-800">{user.email}</span>
        </div>
      </div>

      {/* Event Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
              <Building className="w-3.5 h-3.5" />
              {currentEvent.communityName}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {currentEvent.date}
            </span>
          </div>

          <a
            href={currentEvent.communitySocialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Visit Community LinkedIn</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
          {currentEvent.name}
        </h1>

        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          {currentEvent.description}
        </p>

        {/* 2 Main Tabs Navigation */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('brief')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'brief'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Event Brief</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('generator')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'generator'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>2. LinkedIn Post Generator</span>
            {generatedPost && (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: EVENT BRIEF */}
      {activeTab === 'brief' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Brief Content (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Takeaways Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3>Event Takeaways &amp; Core Themes</h3>
              </div>

              <div className="space-y-3">
                {currentEvent.keyTakeaways && currentEvent.keyTakeaways.length > 0 ? (
                  currentEvent.keyTakeaways.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-800 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">
                    No specific takeaways recorded by organizer.
                  </p>
                )}
              </div>
            </div>

            {/* Attendee Personal Notes Input */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div>
                <label className="block text-sm font-bold text-slate-900">
                  Your Personal Highlights or Notes (Optional)
                </label>
                <p className="text-xs text-slate-500 mt-0.5">
                  Did a specific keynote spark an idea? Add a personal reflection here and Gemini AI will personalize your post!
                </p>
              </div>

              <textarea
                rows={3}
                value={attendeeNotes}
                onChange={(e) => setAttendeeNotes(e.target.value)}
                placeholder="e.g. Loved Marcus's point about goal-directed autonomous loops. Connected with 5 great developers!"
                className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 placeholder:text-slate-400"
              />

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('generator')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <span>Proceed to LinkedIn Generator</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Info Card (1 Col) */}
          <div className="space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Event Logistics
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Host Organization</span>
                  <span className="font-semibold text-slate-800">{currentEvent.communityName}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Date</span>
                  <span className="font-semibold text-slate-800">{currentEvent.date}</span>
                </div>

                {currentEvent.location && (
                  <div>
                    <span className="text-slate-400 block text-[11px]">Venue</span>
                    <span className="font-semibold text-slate-800">{currentEvent.location}</span>
                  </div>
                )}

                <div>
                  <span className="text-slate-400 block text-[11px]">Social Profile</span>
                  <a
                    href={currentEvent.communitySocialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium break-all"
                  >
                    {currentEvent.communitySocialLink}
                  </a>
                </div>
              </div>

              {currentEvent.speakers && currentEvent.speakers.length > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Keynote Speakers
                  </h5>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {currentEvent.speakers.map((spk, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        <span>{spk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Quick Action to Generator */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white space-y-3">
              <div className="p-2 rounded-xl bg-white/10 w-fit text-blue-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold">Ready to publish?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Generate high-engagement post copy and multi-image layouts in parallel with Gemini AI.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('generator')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <span>Switch to Generator Tab</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LINKEDIN POST GENERATOR */}
      {activeTab === 'generator' && (
        <div className="space-y-8">
          {/* Controls Bar: Tone & Layout Selection */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            
            {/* 1. Custom Post Content Writing Prompt / Directives (Gemini 3.8 Flash) */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div>
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>1. Post Content Prompt (Gemini 3.8 Flash Model)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      Dynamic Copywriting
                    </span>
                  </label>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Provide instructions for the post text (angle, takeaways, tone, or specific themes). Gemini 3.8 Flash will generate authentic, non-generic copy based on your directives.
                  </p>
                </div>
              </div>

              <textarea
                rows={3}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. Write an authentic, punchy first-person post about today's sessions. Include 3 specific takeaways, thank the host community, and ask readers for their experience with agent architectures. Keep sentences short, engaging, and free of generic corporate buzzwords."
                className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 placeholder:text-slate-400 bg-white leading-relaxed font-sans"
              />

              {/* Quick Content Prompt Template Recipes */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Content Prompt Templates (Click to apply)
                </span>
                <div className="flex flex-wrap gap-2">
                  {PROMPT_RECIPES.map((recipe, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={isGenerating || isRegeneratingContent}
                      onClick={() => setCustomPrompt(recipe.prompt)}
                      className="text-[11px] font-semibold px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 text-slate-700 transition-all text-left cursor-pointer active:scale-95 shadow-2xs"
                    >
                      {recipe.label}
                    </button>
                  ))}
                  {customPrompt && (
                    <button
                      type="button"
                      disabled={isGenerating || isRegeneratingContent}
                      onClick={() => setCustomPrompt('')}
                      className="text-[11px] font-semibold px-2.5 py-1.5 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-600 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Separate Image Generation Prompt (Nano Banana Model) */}
            <div className="space-y-3 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div>
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>2. Image Generation Prompt (Gemini Nano Banana Model)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      Min 5 Images Created
                    </span>
                  </label>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Specify the visual scene, atmosphere, lighting, and subjects. Gemini Nano Banana will create a multi-perspective set of minimum 5 images formatted to your layout.
                  </p>
                </div>
              </div>

              <textarea
                rows={3}
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="e.g. A high-end cinematic photo of a modern tech convention keynote mainstage with vibrant neon lighting, an inspiring speaker at the podium, and an engaged audience in the auditorium, 8k editorial photography, photorealistic, sharp focus."
                className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-amber-300/80 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-slate-900 placeholder:text-slate-400 bg-white leading-relaxed font-sans"
              />

              {/* Quick Image Prompt Presets */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-amber-800/80 uppercase tracking-wider block">
                  Image Scene Presets (Click to apply)
                </span>
                <div className="flex flex-wrap gap-2">
                  {IMAGE_PROMPT_RECIPES.map((recipe, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={isGenerating || isRegeneratingImages}
                      onClick={() => setImagePrompt(recipe.prompt)}
                      className="text-[11px] font-semibold px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100 hover:text-amber-900 hover:border-amber-400 border border-amber-200 text-slate-700 transition-all text-left cursor-pointer active:scale-95 shadow-2xs"
                    >
                      {recipe.label}
                    </button>
                  ))}
                  {imagePrompt && (
                    <button
                      type="button"
                      disabled={isGenerating || isRegeneratingImages}
                      onClick={() => setImagePrompt('')}
                      className="text-[11px] font-semibold px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                Post Voice &amp; Tone Style
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Tailor the voice of the post to match your personal brand on LinkedIn.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {TONE_OPTIONS.map((tone) => {
                  const isSelected = selectedTone === tone.id;
                  return (
                    <button
                      key={tone.id}
                      type="button"
                      disabled={isGenerating}
                      onClick={() => setSelectedTone(tone.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 text-blue-900'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs truncate">{tone.label}</div>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                        {tone.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Layout Selector with Mock Visuals */}
            <LayoutSelector
              selectedLayout={selectedLayout}
              onSelectLayout={setSelectedLayout}
              disabled={isGenerating}
            />

            {/* Generate Button Container */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>
                  Parallel Execution: Gemini 3.8 Flash (Custom Prompt) + Gemini Nano Banana (Real Images)
                </span>
              </div>

              <button
                type="button"
                disabled={!selectedLayout || isGenerating}
                onClick={handleGeneratePost}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/25 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Post &amp; Visuals in Parallel...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Post &amp; 5 Images (Nano Banana)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {generationError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center justify-between">
              <span>{generationError}</span>
              <button
                type="button"
                onClick={handleGeneratePost}
                className="font-bold underline cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {/* Generating Loading State with Skeletons */}
          {isGenerating && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs text-center space-y-5 animate-pulse">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Loader2 className="w-7 h-7 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Synthesizing High-Impact Content &amp; Visuals
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Executing parallel tasks: crafting authentic LinkedIn copy with Gemini 3.8 Flash, and rendering your multi-image layout assets.
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-2 pt-2">
                <div className="h-3 bg-slate-200 rounded-full w-full"></div>
                <div className="h-3 bg-slate-200 rounded-full w-5/6 mx-auto"></div>
                <div className="h-3 bg-slate-200 rounded-full w-4/6 mx-auto"></div>
              </div>
            </div>
          )}

          {/* LinkedIn Style Preview (Shown when generation is complete) */}
          {generatedPost && !isGenerating && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Interactive LinkedIn Post Preview
                  </h2>
                  <p className="text-xs text-slate-500">
                    Content generated by Gemini 3.8 Flash • Visuals generated by Gemini Nano Banana
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={isRegeneratingContent || isGenerating}
                    onClick={handleRegenerateContentOnly}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isRegeneratingContent ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                    )}
                    <span>Regenerate Copy (Gemini)</span>
                  </button>

                  <button
                    type="button"
                    disabled={isRegeneratingImages || isGenerating}
                    onClick={handleRegenerateImagesOnly}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-xs font-semibold text-amber-900 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isRegeneratingImages ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    <span>Regenerate 5 Images (Nano Banana)</span>
                  </button>

                  <button
                    type="button"
                    disabled={isGenerating || isRegeneratingContent || isRegeneratingImages}
                    onClick={handleGeneratePost}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Regenerate Both</span>
                  </button>
                </div>
              </div>

              <LinkedInPostPreview
                postData={generatedPost}
                user={user}
                eventName={currentEvent.name}
                communityName={currentEvent.communityName}
                onUpdatePostText={(updated) => {
                  setGeneratedPost({
                    ...generatedPost,
                    postText: updated,
                  });
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
