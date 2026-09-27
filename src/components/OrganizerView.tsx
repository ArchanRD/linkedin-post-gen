import React, { useState } from 'react';
import { EventItem, UserProfile } from '../types';
import { CreateEventModal } from './CreateEventModal';
import { 
  Plus, 
  Calendar, 
  Users, 
  Link2, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Eye, 
  Sparkles, 
  Search, 
  Building, 
  MapPin, 
  Mail, 
  X,
  UserCheck
} from 'lucide-react';

interface OrganizerViewProps {
  events: EventItem[];
  user: UserProfile;
  onEventCreated: (newEvent: EventItem) => void;
  onOpenPublicForm: (event: EventItem) => void;
}

export const OrganizerView: React.FC<OrganizerViewProps> = ({
  events,
  user,
  onEventCreated,
  onOpenPublicForm,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null);
  const [viewingAttendeesEvent, setViewingAttendeesEvent] = useState<EventItem | null>(null);

  // Filter events based on search
  const filteredEvents = events.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.communityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAttendees = events.reduce(
    (acc, cur) => acc + (cur.registeredAttendees?.length || 0),
    0
  );

  const handleCopyPublicLink = (event: EventItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/?eventForm=${event.id}`;
    navigator.clipboard.writeText(url);
    setCopiedEventId(event.id);
    setTimeout(() => setCopiedEventId(null), 2500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner & Quick Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            Organizer Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Event Management Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Create community events, distribute public registration forms, and track attendee engagement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Events
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">
            {events.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Active across communities</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Registered Attendees
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">
            {totalAttendees}
          </div>
          <p className="text-xs text-slate-500 mt-1">Submitted email on public forms</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Public Registration
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">
            Live
          </div>
          <p className="text-xs text-slate-500 mt-1">Direct link with email signup</p>
        </div>
      </div>

      {/* Events List Header with Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Created Events ({filteredEvents.length})
            </h2>
            <p className="text-xs text-slate-500">
              Click on any event to inspect registered emails or open its public registration form.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by event or community..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>

        {/* Event Cards Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-300">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No events found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Get started by creating your first community event with a public registration link.
            </p>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map((event) => {
              const attendeeCount = event.registeredAttendees?.length || 0;
              const isCopied = copiedEventId === event.id;

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-5 space-y-3.5">
                    {/* Community pill & Date */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                        <Building className="w-3 h-3 text-slate-500" />
                        <span className="truncate max-w-[130px]">{event.communityName}</span>
                      </span>

                      <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{event.date}</span>
                      </div>
                    </div>

                    {/* Event Title */}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {event.name}
                    </h3>

                    {/* Description preview */}
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Community Social Link */}
                    <div className="pt-1">
                      <a
                        href={event.communitySocialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[220px]">
                          {event.communitySocialLink.replace(/^https?:\/\//, '')}
                        </span>
                      </a>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                    {/* Attendees counter button */}
                    <button
                      type="button"
                      onClick={() => setViewingAttendeesEvent(event)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>{attendeeCount} {attendeeCount === 1 ? 'Attendee' : 'Attendees'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {/* Copy Public Link Button */}
                      <button
                        type="button"
                        onClick={(e) => handleCopyPublicLink(event, e)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                        title="Copy Public Registration Form Link"
                      >
                        {isCopied ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      {/* Open Public Form Button */}
                      <button
                        type="button"
                        onClick={() => onOpenPublicForm(event)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Public Form</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Attendees Drawer / Modal */}
      {viewingAttendeesEvent && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setViewingAttendeesEvent(null)}
        >
          <div 
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Registered Attendees</h3>
                <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                  {viewingAttendeesEvent.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingAttendeesEvent(null)}
                className="p-1.5 text-slate-300 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold border-b border-slate-100 pb-2">
                <span>Attendee Email</span>
                <span>Registration Date</span>
              </div>

              {viewingAttendeesEvent.registeredAttendees?.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No attendees have registered for this event yet. Share the public form link to get signups!
                </div>
              ) : (
                <div className="space-y-2">
                  {viewingAttendeesEvent.registeredAttendees.map((att, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                    >
                      <div className="flex items-center gap-2 text-slate-800 font-medium">
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        <span>{att.email}</span>
                      </div>
                      <span className="text-slate-400 text-[11px]">
                        {new Date(att.registeredAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Total: {viewingAttendeesEvent.registeredAttendees?.length || 0} registered
              </span>
              <button
                type="button"
                onClick={() => {
                  onOpenPublicForm(viewingAttendeesEvent);
                  setViewingAttendeesEvent(null);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open Public Form
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={onEventCreated}
        organizerEmail={user.email}
      />
    </div>
  );
};
