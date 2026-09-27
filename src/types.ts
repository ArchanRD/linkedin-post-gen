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

export type PostImageLayout = 'single-hero' | 'dual-split' | 'triptych-grid' | 'quad-mosaic';

export interface LayoutOption {
  id: PostImageLayout;
  title: string;
  subtitle: string;
  imageCount: number;
  description: string;
  wireframe: '1' | '1+1' | '1+2' | '2x2';
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
  tone: PostTone;
  layout: PostImageLayout;
  userName?: string;
  userHeadline?: string;
}

export interface GeneratedImageItem {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  aspectRatio?: string;
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
}
