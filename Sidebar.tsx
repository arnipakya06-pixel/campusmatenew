import React from 'react';
import { useCampusMate } from '../../context/CampusMateContext';
import { TabType } from '../../types';
import { Logo } from '../common/Logo';
import {
  LayoutDashboard,
  Sparkles,
  UserCheck,
  GraduationCap,
  Award,
  BookOpen,
  CalendarClock,
  Bell,
  Briefcase,
  Trophy,
  FileBadge,
  FolderLock,
  MapPin,
  ShieldAlert,
  User,
  X,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    attendance,
    deadlines,
    scholarships,
    assignments,
    notifications,
  } = useCampusMate();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pendingAssignments = assignments.filter((a) => a.status === 'Pending').length;
  const activeDeadlinesCount = deadlines.filter((d) => !d.completed).length;

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'ai-assistant',
      label: 'AI Assistant',
      icon: Sparkles,
      badge: 'AI',
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: UserCheck,
      badge: `${((attendance.presentDays / attendance.workingDays) * 100).toFixed(0)}%`,
      badgeColor:
        (attendance.presentDays / attendance.workingDays) * 100 >= 75
          ? 'bg-emerald-100 text-emerald-800'
          : 'bg-rose-100 text-rose-800 font-bold',
    },
    {
      id: 'results',
      label: 'Results & CGPA',
      icon: GraduationCap,
      badge: '8.29',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'scholarships',
      label: 'Scholarships',
      icon: Award,
      badge: scholarships.length,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'academics',
      label: 'Academics',
      icon: BookOpen,
      badge: pendingAssignments > 0 ? `${pendingAssignments} pending` : undefined,
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
    {
      id: 'deadlines',
      label: 'Deadlines',
      icon: CalendarClock,
      badge: activeDeadlinesCount,
      badgeColor: 'bg-rose-100 text-rose-800',
    },
    {
      id: 'notices',
      label: 'Notices & Events',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
      badgeColor: 'bg-purple-100 text-purple-800',
    },
    {
      id: 'career',
      label: 'Career & Placements',
      icon: Briefcase,
      badge: '3 Drives',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Trophy,
    },
    {
      id: 'resume',
      label: 'Resume Builder',
      icon: FileBadge,
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FolderLock,
    },
    {
      id: 'campus-map',
      label: 'Campus Map',
      icon: MapPin,
    },
    {
      id: 'emergency',
      label: 'Emergency',
      icon: ShieldAlert,
      badge: 'SOS',
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
    },
  ];

  const handleNavClick = (tab: TabType) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <Logo />
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-3 pb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Menu Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-white/20 text-white border border-white/30'
                          : item.badgeColor || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom Student ID Badge Card */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70">
          <div
            onClick={() => handleNavClick('profile')}
            className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-300 transition-colors cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              CM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600">
                Abisha (CM2026-001)
              </p>
              <p className="text-[11px] text-slate-500 truncate">AI & Data Science • Sec A</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
