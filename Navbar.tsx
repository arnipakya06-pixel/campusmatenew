import React, { useState, useRef, useEffect } from 'react';
import { useCampusMate } from '../../context/CampusMateContext';
import { NotificationDrawer } from '../common/NotificationDrawer';
import {
  Search,
  Bell,
  Menu,
  Sparkles,
  Presentation,
  User,
  GraduationCap,
  LogOut,
  Settings,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar }) => {
  const {
    student,
    notifications,
    setGlobalSearchOpen,
    presentationMode,
    togglePresentationMode,
    setActiveTab,
    resetDemoData,
  } = useCampusMate();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 transition-shadow">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile Sidebar Toggle + Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Global Search Button */}
          <button
            onClick={() => setGlobalSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-slate-400 bg-slate-100/80 hover:bg-slate-100 rounded-xl border border-slate-200/70 transition-all hover:border-indigo-300 group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              <span className="hidden sm:inline text-xs font-medium text-slate-500 group-hover:text-slate-700">
                Search scholarships, deadlines, campus locations...
              </span>
              <span className="sm:hidden text-xs font-medium text-slate-500">Search...</span>
            </div>
            <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Expo Presentation Mode Toggle Button */}
          <button
            onClick={togglePresentationMode}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              presentationMode
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs ring-2 ring-amber-400/30'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200/80 hover:bg-indigo-100'
            }`}
            title="Toggle Expo Presentation Mode"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {presentationMode ? 'Exit Presentation' : 'Expo Mode'}
            </span>
          </button>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            <NotificationDrawer
              open={notificationOpen}
              onClose={() => setNotificationOpen(false)}
            />
          </div>

          {/* Student Avatar & Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 p-1 sm:pl-2 sm:pr-3 rounded-xl hover:bg-slate-100 transition-colors text-left"
            >
              <img
                src={student.avatarUrl}
                alt={student.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-600/30"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
                  {student.name}
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </p>
                <p className="text-[10px] text-slate-500 font-medium leading-tight">
                  {student.department}
                </p>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{student.name}</p>
                  <p className="text-[11px] text-slate-500">{student.studentId} • {student.year}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      CGPA: {student.currentCgpa.toFixed(2)}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Attendance: 78%
                    </span>
                  </div>
                </div>

                <div className="py-1 text-xs">
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 text-left font-medium"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    Student Profile
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('resume');
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 text-left font-medium"
                  >
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    Resume Builder
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('ai-assistant');
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 text-left font-medium"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    CampusMate AI
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1 mt-1">
                  <button
                    onClick={() => {
                      if (confirm('Reset demo state back to default Abisha profile?')) {
                        resetDemoData();
                        setProfileOpen(false);
                      }
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left font-medium"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    Reset Demo State
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
