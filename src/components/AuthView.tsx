import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { 
  Sparkles, 
  UserCheck, 
  Users, 
  ArrowRight, 
  Mail, 
  Check, 
  ShieldCheck, 
  Lock,
  Layers,
  Calendar
} from 'lucide-react';

interface AuthViewProps {
  onLogin: (user: UserProfile) => void;
  defaultEmail?: string;
  defaultRole?: UserRole;
}

export const AuthView: React.FC<AuthViewProps> = ({
  onLogin,
  defaultEmail = 'archanrd29@gmail.com',
  defaultRole = 'organizer',
}) => {
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [email, setEmail] = useState(defaultEmail);
  const [name, setName] = useState(
    role === 'organizer' ? 'Archan Organizer' : 'Archan Attendee'
  );
  const [headline, setHeadline] = useState(
    role === 'organizer'
      ? 'Community Director | AI Innovators Global'
      : 'Senior AI Engineer & Tech Enthusiast'
  );

  // Sync default names when role changes if user hasn't heavily customized
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'organizer') {
      setName('Archan Organizer');
      setHeadline('Community Director | AI Innovators Global');
    } else {
      setName('Archan Attendee');
      setHeadline('Senior AI Engineer & Tech Enthusiast');
    }
  };

  const handleGoogleSignIn = () => {
    const finalEmail = email.trim().toLowerCase() || 'archanrd29@gmail.com';
    const profile: UserProfile = {
      email: finalEmail,
      name: name.trim() || (role === 'organizer' ? 'Event Organizer' : 'Event Attendee'),
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || finalEmail)}`,
      role,
      headline: headline.trim(),
    };
    onLogin(profile);
  };

  return (
    <div className="min-h-[100dvh] bg-slate-950 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 selection:bg-blue-500 selection:text-white">
      {/* Background Lighting Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-blue-600/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 right-10 w-[600px] h-[350px] bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto w-full my-auto">
        {/* Logo & Headline */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            EngagePulse AI Studio
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            LinkedIn Post Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xs mx-auto">
            Parallel AI post crafting and multi-layout visuals for event hosts &amp; attendees.
          </p>
        </div>

        {/* Unified Login Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
          {/* Step 1: Select Role */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-2.5 p-1 bg-slate-950 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => handleRoleChange('organizer')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  role === 'organizer'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Organizer</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('attendee')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  role === 'attendee'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Attendee</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 text-center">
              {role === 'organizer'
                ? 'Create events, manage public registration forms, and track signups.'
                : 'Access your registered event briefs and generate AI LinkedIn posts.'}
            </p>
          </div>

          {/* Email Address */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Google Account Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="archanrd29@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:outline-hidden focus:border-blue-500 text-xs sm:text-sm text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Profile Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:outline-hidden focus:border-blue-500 text-xs sm:text-sm text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* PRIMARY ACTION: Sign In with Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-98 cursor-pointer"
          >
            {/* Multicolored Google SVG */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google as {role === 'organizer' ? 'Organizer' : 'Attendee'}</span>
          </button>

          {/* Quick 1-Click Demo Profiles */}
          <div className="pt-2 border-t border-slate-800">
            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center mb-2.5">
              Quick Test Profiles
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setRole('organizer');
                  setEmail('archanrd29@gmail.com');
                  setName('Archan (Organizer)');
                  setHeadline('Lead Community Organizer | Global AI Summit');
                  onLogin({
                    email: 'archanrd29@gmail.com',
                    name: 'Archan (Organizer)',
                    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Organizer',
                    role: 'organizer',
                    headline: 'Lead Community Organizer | Global AI Summit',
                  });
                }}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-left border border-slate-800 transition-colors cursor-pointer group"
              >
                <div className="font-bold text-blue-400 group-hover:underline text-[11px]">
                  Organizer Demo
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  archanrd29@gmail.com
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole('attendee');
                  setEmail('archanrd29@gmail.com');
                  setName('Archan (Attendee)');
                  setHeadline('Senior AI Specialist | Summit Attendee');
                  onLogin({
                    email: 'archanrd29@gmail.com',
                    name: 'Archan (Attendee)',
                    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Attendee',
                    role: 'attendee',
                    headline: 'Senior AI Specialist | Summit Attendee',
                  });
                }}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-left border border-slate-800 transition-colors cursor-pointer group"
              >
                <div className="font-bold text-emerald-400 group-hover:underline text-[11px]">
                  Attendee Demo
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  2 Registered Events
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 text-center text-xs text-slate-500">
        EngagePulse • Built for LinkedIn Thought Leaders &amp; Event Organizers
      </div>
    </div>
  );
};
