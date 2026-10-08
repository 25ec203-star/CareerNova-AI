import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AvatarViewer } from '../3d/AvatarViewer';
import pandaTransparentPng from '../../assets/images/panda_transparent.png';
import {
  Bell,
  Sparkles,
  LogOut,
  Flame,
  Check,
  X,
  Heart,
} from 'lucide-react';

export const Navbar: React.FC<{ onOpenMobileMenu?: () => void }> = ({ onOpenMobileMenu }) => {
  const { state, logout, setCurrentTab, markNotificationsAsRead } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 w-full bg-[#060814]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Zone 1: Brand Zone - Single text element wordmark */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          type="button"
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-850"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <button
          onClick={() => setCurrentTab('dashboard')}
          type="button"
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors whitespace-nowrap">
            CareerNova AI
          </span>
        </button>
      </div>

      {/* Zone 2: Clean 1-line metadata context */}
      <div className="hidden md:flex items-center gap-6 text-xs text-slate-400 font-medium">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className="hover:text-cyan-300 transition-colors cursor-pointer"
        >
          Dashboard
        </button>
        <button
          onClick={() => setCurrentTab('career-core')}
          className="hover:text-cyan-300 transition-colors cursor-pointer"
        >
          3D Core
        </button>
        <button
          onClick={() => setCurrentTab('coding-arena')}
          className="hover:text-cyan-300 transition-colors cursor-pointer"
        >
          Coding Arena
        </button>
        <button
          onClick={() => setCurrentTab('resume-ai')}
          className="hover:text-cyan-300 transition-colors cursor-pointer"
        >
          Resume AI
        </button>
        <button
          onClick={() => setCurrentTab('ai-mentor')}
          className="hover:text-cyan-300 transition-colors cursor-pointer"
        >
          AI Mentor
        </button>
      </div>

      {/* Zone 3: Actions - Gamification Stats, Notifications, 3D Avatar Profile */}
      <div className="flex items-center gap-3">
        {/* Nova Panda Mascot Status */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-xs">
          <div className="relative w-5 h-5 shrink-0 flex items-center justify-center">
            <img
              src={pandaTransparentPng}
              alt="Nova"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(0,240,255,0.4)] animate-bounce"
            />
          </div>
          <span className="text-[11px] font-mono text-cyan-300">Nova Vibing 🐾</span>
        </div>

        {/* Streak & XP */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono tabular-nums text-amber-300 font-semibold">{state.streakDays}d</span>
          <span className="text-slate-600">/</span>
          <span className="font-mono tabular-nums text-cyan-400 font-semibold">{state.xp} XP</span>
          <span className="hidden xl:inline text-slate-500">· {state.level}</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications && unreadCount > 0) {
                markNotificationsAsRead();
              }
            }}
            type="button"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 relative transition cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Activity Feed
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {state.notifications.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  No new notifications.
                  <div className="text-[11px] text-slate-600 mt-1">
                    Activity updates will appear here in real-time.
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {state.notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs"
                    >
                      <div className="flex items-center justify-between font-semibold text-white mb-1">
                        <span>{notif.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3D Profile Avatar Thumbnail & Quick Menu */}
        <button
          onClick={() => setCurrentTab('profile')}
          type="button"
          className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group"
          title="Open Profile & 3D Avatar Customizer"
        >
          <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-950 border border-cyan-500/30 shrink-0">
            <AvatarViewer size="xs" interactive={false} />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors leading-tight">
              {state.user.name}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              {state.user.targetRole.split(' ')[0]}
            </div>
          </div>
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          type="button"
          title="Sign out"
          className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
