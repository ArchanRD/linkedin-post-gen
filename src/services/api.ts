import { EventItem, GeneratePostRequest, GeneratedPostResponse } from '../types';
import { generateClientFallbackPost } from './clientGenerator';
import { INITIAL_EVENTS } from '../data/mockInitialData';

// Local storage key for offline or static hosting registrations
const LOCAL_STORAGE_EVENTS_KEY = 'engagepulse_custom_events';

function getStoredCustomEvents(): EventItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustomEvent(event: EventItem) {
  try {
    const current = getStoredCustomEvents();
    localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify([event, ...current]));
  } catch {
    // Ignore
  }
}

export const api = {
  // Fetch all events
  async getEvents(): Promise<EventItem[]> {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.events) && data.events.length > 0) {
          const custom = getStoredCustomEvents();
          // Merge custom events without duplicates
          const ids = new Set(data.events.map((e: EventItem) => e.id));
          const merged = [...data.events, ...custom.filter((c) => !ids.has(c.id))];
          return merged;
        }
      }
    } catch {
      // Fallback below
    }

    // Fallback if /api/events 404s on static hosting
    const custom = getStoredCustomEvents();
    const ids = new Set(INITIAL_EVENTS.map((e) => e.id));
    return [...custom.filter((c) => !ids.has(c.id)), ...INITIAL_EVENTS];
  },

  // Fetch single event
  async getEventById(id: string): Promise<EventItem> {
    try {
      const res = await fetch(`/api/events/${id}`);
      if (res.ok) {
        const data = await res.json();
        return data.event;
      }
    } catch {
      // Fallback
    }

    const all = await this.getEvents();
    const found = all.find((e) => e.id === id);
    if (!found) throw new Error('Event not found');
    return found;
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
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      if (res.ok) {
        const data = await res.json();
        saveCustomEvent(data.event);
        return data.event;
      }
    } catch {
      // Fallback
    }

    // Client-side fallback creation
    const newEvent: EventItem = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: eventData.name.trim(),
      date: eventData.date.trim(),
      communityName: eventData.communityName.trim(),
      communitySocialLink: eventData.communitySocialLink.trim(),
      description: eventData.description || `An engaging community meetup by ${eventData.communityName}`,
      keyTakeaways: eventData.keyTakeaways || ['Practical insights & modern workflows', 'Valuable peer networking'],
      speakers: eventData.speakers || [],
      location: eventData.location || 'Virtual / In-person',
      category: eventData.category || 'Tech',
      organizerEmail: eventData.organizerEmail || 'organizer@community.org',
      registeredAttendees: [],
      createdAt: new Date().toISOString(),
    };
    saveCustomEvent(newEvent);
    return newEvent;
  },

  // Public registration form endpoint: takes only email
  async registerForEvent(eventId: string, email: string): Promise<{ success: boolean; message: string; event: EventItem }> {
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback below
    }

    // Offline / static hosting registration fallback
    const all = await this.getEvents();
    const event = all.find((e) => e.id === eventId) || INITIAL_EVENTS[0];
    if (!event.registeredAttendees.some((a) => a.email.toLowerCase() === normalizedEmail)) {
      event.registeredAttendees.push({
        email: normalizedEmail,
        registeredAt: new Date().toISOString(),
      });
      saveCustomEvent(event);
    }

    return {
      success: true,
      message: 'Successfully registered for event!',
      event,
    };
  },

  // Get events registered by attendee's email
  async getRegisteredEvents(email: string): Promise<EventItem[]> {
    const normalizedEmail = decodeURIComponent(email).trim().toLowerCase();
    try {
      const res = await fetch(`/api/registrations/${encodeURIComponent(normalizedEmail)}`);
      if (res.ok) {
        const data = await res.json();
        return data.registeredEvents;
      }
    } catch {
      // Fallback
    }

    const all = await this.getEvents();
    return all.filter((e) =>
      e.registeredAttendees?.some((a) => a.email.toLowerCase() === normalizedEmail)
    );
  },

  // Generate full LinkedIn post + images in parallel with Gemini API
  async generateFullPost(request: GeneratePostRequest): Promise<GeneratedPostResponse> {
    try {
      const res = await fetch('/api/gemini/generate-full-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.postText && data.images && data.images.length > 0) {
          return data;
        }
      } else {
        console.warn(`[API] /api/gemini/generate-full-post returned status ${res.status}. Falling back to client-side generation engine.`);
      }
    } catch (networkErr) {
      console.warn('[API Network Error] Backend route not reachable, using client-side generator engine:', networkErr);
    }

    // Client-side fallback generation engine — produces high-fidelity post copy & multi-layout visual cards
    return generateClientFallbackPost(request);
  },
};

