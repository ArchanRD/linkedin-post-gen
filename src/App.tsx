import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole, EventItem } from './types';
import { api } from './services/api';
import { INITIAL_EVENTS } from './data/mockInitialData';
import { Navbar } from './components/Navbar';
import { AuthView } from './components/AuthView';
import { OrganizerView } from './components/OrganizerView';
import { AttendeeView } from './components/AttendeeView';
import { PublicRegistrationView } from './components/PublicRegistrationView';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('engagepulse_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [publicFormEventId, setPublicFormEventId] = useState<string | null>(null);
  const [selectedAttendeeEventId, setSelectedAttendeeEventId] = useState<string | null>(null);

  // Check URL query parameters for ?eventForm=<id> on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const formId = params.get('eventForm') || params.get('register');
    if (formId) {
      setPublicFormEventId(formId);
    }
  }, []);

  // Fetch all events from backend
  const fetchEvents = async () => {
    try {
      setIsLoadingEvents(true);
      const data = await api.getEvents();
      if (Array.isArray(data) && data.length > 0) {
        setEvents(data);
      }
    } catch (err) {
      console.warn('[Fetch Events Error]', err);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Save user profile changes to local storage
  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
    try {
      localStorage.setItem('engagepulse_user', JSON.stringify(newUser));
    } catch {
      // Ignore
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('engagepulse_user');
    } catch {
      // Ignore
    }
  };

  const handleSwitchRole = (newRole: UserRole) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      role: newRole,
    };
    setUser(updated);
    try {
      localStorage.setItem('engagepulse_user', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleEventCreated = (newEvent: EventItem) => {
    setEvents((prev) => [newEvent, ...prev]);
  };

  // Open Public Form from organizer or attendee
  const handleOpenPublicForm = (event: EventItem) => {
    setPublicFormEventId(event.id);
    const url = new URL(window.location.href);
    url.searchParams.set('eventForm', event.id);
    window.history.pushState({}, '', url.toString());
  };

  const handleClosePublicForm = () => {
    setPublicFormEventId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('eventForm');
    url.searchParams.delete('register');
    window.history.pushState({}, '', url.toString());
  };

  // When an attendee registers on the public form and clicks "Sign in with Google"
  const handleRegisteredAndLogin = (registeredEmail: string) => {
    const attendeeProfile: UserProfile = {
      email: registeredEmail,
      name: registeredEmail.split('@')[0],
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(registeredEmail)}`,
      role: 'attendee',
      headline: 'Tech Community Member & Attendee',
    };
    handleLogin(attendeeProfile);
    if (publicFormEventId) {
      setSelectedAttendeeEventId(publicFormEventId);
    }
    handleClosePublicForm();
    fetchEvents();
  };

  // -------------------------------------------------------------
  // ROUTE 1: PUBLIC REGISTRATION FORM (Standalone public view)
  // -------------------------------------------------------------
  if (publicFormEventId) {
    const targetEvent = events.find((e) => e.id === publicFormEventId) || events[0];
    return (
      <PublicRegistrationView
        event={targetEvent}
        onBackToApp={handleClosePublicForm}
        onRegisteredAndLogin={handleRegisteredAndLogin}
      />
    );
  }

  // -------------------------------------------------------------
  // ROUTE 2: AUTH SCREEN (If user is not logged in)
  // -------------------------------------------------------------
  if (!user) {
    return (
      <AuthView
        onLogin={handleLogin}
        defaultEmail="archanrd29@gmail.com"
        defaultRole="organizer"
      />
    );
  }

  // -------------------------------------------------------------
  // ROUTE 3: AUTHENTICATED APP PORTAL (Organizer or Attendee)
  // -------------------------------------------------------------
  return (
    <div className="min-h-[100dvh] bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar
        user={user}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
        onOpenAnyPublicForm={() => events[0] && handleOpenPublicForm(events[0])}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {user.role === 'organizer' ? (
          <OrganizerView
            events={events}
            user={user}
            onEventCreated={handleEventCreated}
            onOpenPublicForm={handleOpenPublicForm}
          />
        ) : (
          <AttendeeView
            events={events}
            user={user}
            onRefreshEvents={fetchEvents}
            initialSelectedEventId={selectedAttendeeEventId}
          />
        )}
      </main>
    </div>
  );
}
