import { EventItem, GeneratePostRequest, GeneratedPostResponse } from '../types';

export const api = {
  // Fetch all events
  async getEvents(): Promise<EventItem[]> {
    const res = await fetch('/api/events');
    if (!res.ok) throw new Error('Failed to fetch events');
    const data = await res.json();
    return data.events;
  },

  // Fetch single event
  async getEventById(id: string): Promise<EventItem> {
    const res = await fetch(`/api/events/${id}`);
    if (!res.ok) throw new Error('Failed to fetch event');
    const data = await res.json();
    return data.event;
  },

  // Create an event (Organizer)
  async createEvent(eventData: {
    name: string;
    date: string;
    communityName: string;
    communitySocialLink: string;
    description?: string;
    keyTakeaways?: string[];
    speakers?: string[];
    location?: string;
    category?: string;
    organizerEmail?: string;
  }): Promise<EventItem> {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create event');
    }
    const data = await res.json();
    return data.event;
  },

  // Public registration form endpoint: takes only email
  async registerForEvent(eventId: string, email: string): Promise<{ success: boolean; message: string; event: EventItem }> {
    const res = await fetch(`/api/events/${eventId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  // Get events registered by attendee's email
  async getRegisteredEvents(email: string): Promise<EventItem[]> {
    const res = await fetch(`/api/registrations/${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error('Failed to fetch registered events');
    const data = await res.json();
    return data.registeredEvents;
  },

  // Generate full LinkedIn post + images in parallel with Gemini API
  async generateFullPost(request: GeneratePostRequest): Promise<GeneratedPostResponse> {
    const res = await fetch('/api/gemini/generate-full-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate post');
    }
    return res.json();
  },
};
