export type UserRole = 'organizer' | 'attendee';

export interface UserProfile {
  email: string;
  name: string;
  avatarUrl: string;
  role: UserRole;
  headline?: string;
}

export interface EventRegistration {
  email: string;
  registeredAt: string;
}

export interface EventItem {
  id: string;
  name: string;
  date: string;
  communityName: string;
  communitySocialLink: string;
  description: string;
  keyTakeaways?: string[];
  speakers?: string[];
  location?: string;
  bannerImage?: string;
  category?: string;
  organizerEmail: string;
  registeredAttendees: EventRegistration[];
  createdAt: string;
}

export type PostImageLayout = 
  | 'text-up-image-below'
  | 'text-left-image-right'
  | 'text-right-image-left'
  | 'image-only'
  | 'text-on-image-fullscreen';

export interface LayoutOption {
  id: PostImageLayout;
  title: string;
  subtitle: string;
  imageCount: number;
  description: string;
  wireframe: 'text-up' | 'text-left' | 'text-right' | 'image-only' | 'text-overlay';
}

export type PostTone = 
  | 'Thought Leadership'
  | 'Enthusiastic & Inspiring'
  | 'Crisp & Professional'
  | 'Storyteller & Reflective'
  | 'Community & Networking';

export interface GeneratePostRequest {
  eventId: string;
  eventName: string;
  communityName: string;
  communitySocialLink: string;
  date: string;
  description?: string;
  keyTakeaways?: string[];
  attendeeNotes?: string;
  customPrompt?: string; // Content prompt for Gemini text model
  imagePrompt?: string;  // Dedicated image prompt for Nano Banana image model
  tone: PostTone;
  layout: PostImageLayout;
  userName?: string;
  userHeadline?: string;
}

export interface GenerateImagesRequest {
  eventName: string;
  communityName: string;
  layout: PostImageLayout;
  imagePrompt?: string;
  description?: string;
}

export interface GeneratedImageItem {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  aspectRatio?: string;
  modelUsed?: string;
}

export interface GeneratedPostResponse {
  postText: string;
  headlineHook: string;
  keyTakeaways: string[];
  hashtags: string[];
  mentions: string[];
  images: GeneratedImageItem[];
  layout: PostImageLayout;
  generatedAt: string;
  imagePrompt?: string;
  contentPrompt?: string;
  imageModelUsed?: string;
}
