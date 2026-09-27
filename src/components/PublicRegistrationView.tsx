import React, { useState } from 'react';
import { EventItem } from '../types';
import { api } from '../services/api';
import { 
  Calendar, 
  MapPin, 
  Link2, 
  Mail, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Building,
  ShieldCheck,
  Check
} from 'lucide-react';

interface PublicRegistrationViewProps {
  event: EventItem;
  onBackToApp?: () => void;
  onRegisteredAndLogin?: (email: string) => void;
}

export const PublicRegistrationView: React.FC<PublicRegistrationViewProps> = ({
  event,
  onBackToApp,
  onRegisteredAndLogin,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.registerForEvent(event.id, cleanEmail);
      setRegisteredEmail(cleanEmail);
      setIsRegistered(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-slate-100 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 selection:bg-blue-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-xl mx-auto w-full">
        {/* Top Back Navigation if within app */}
        {onBackToApp && (
          <button
            type="button"
            onClick={onBackToApp}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to App Portal
          </button>
        )}

        {/* Community & Event Header Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Host Community Tag */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
              <Building className="w-3.5 h-3.5" />
              <span>{event.communityName}</span>
            </div>

            <a
              href={event.communitySocialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-blue-400 transition-colors"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Community Profile</span>
            </a>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {event.name}
          </h1>

          {/* Event Meta Badges */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="font-medium">{event.date}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {/* Event Description */}
          {event.description && (
            <p className="mt-5 text-sm text-slate-300 leading-relaxed">
              {event.description}
            </p>
          )}

          {/* Key Takeaways if available */}
          {event.keyTakeaways && event.keyTakeaways.length > 0 && (
            <div className="mt-6 pt-5 border-t border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                What You Will Learn
              </h4>
              <ul className="space-y-1.5">
                {event.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* REGISTRATION FORM SECTION */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            {isRegistered ? (
              /* Success State */
              <div className="text-center py-6 px-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-4 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 shadow-sm">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Registration Confirmed!</h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-sm mx-auto">
                    You are now registered for this event with{' '}
                    <span className="font-semibold text-emerald-400">{registeredEmail}</span>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs text-slate-300 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-blue-400">
                    <Sparkles className="w-4 h-4" /> Next Step: Sign In with Google
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Log in with Google using this same email address to access your event brief and generate AI-crafted LinkedIn posts and layout visuals.
                  </p>
                </div>

                {onRegisteredAndLogin && (
                  <button
                    type="button"
                    onClick={() => onRegisteredAndLogin(registeredEmail)}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg active:scale-98 cursor-pointer"
                  >
                    <span>Sign In with Google as Attendee</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              /* Registration Input Form */
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Attendee Registration
                    </label>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Only email needed
                    </span>
                  </div>

                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email to register..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold transition-all shadow-lg active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    'Registering...'
                  ) : (
                    <>
                      <span>Register for Event</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  By registering, you can later sign in with Google to generate high-engagement LinkedIn posts and branded visuals.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 text-center text-xs text-slate-500 mt-8">
        Powered by EngagePulse • Verified LinkedIn Post Generator
      </div>
    </div>
  );
};
