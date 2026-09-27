import React, { useState } from 'react';
import { useCampusMate } from '../../context/CampusMateContext';
import { TabType } from '../../types';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Award,
  Calendar,
  Briefcase,
  BookOpen,
  Check,
  ShieldCheck,
  X,
} from 'lucide-react';

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ open, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, setActiveTab } = useCampusMate();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [browserPermStatus, setBrowserPermStatus] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  if (!open) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredList = notifications.filter((n) => (filter === 'unread' ? !n.read : true));

  const handleRequestBrowserPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser environment does not support system push notifications. In-app notifications remain active.');
      setBrowserPermStatus('unsupported');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setBrowserPermStatus(permission);
      if (permission === 'granted') {
        new Notification('CampusMate Notifications Enabled', {
          body: 'You will receive critical attendance alerts and deadline reminders.',
          icon: '/favicon.ico',
        });
      }
    } catch (e) {
      console.error('Notification permission error:', e);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'attendance':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'deadline':
        return <Calendar className="w-4 h-4 text-rose-600" />;
      case 'scholarship':
        return <Award className="w-4 h-4 text-emerald-600" />;
      case 'placement':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'academic':
        return <BookOpen className="w-4 h-4 text-indigo-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleNotificationClick = (id: string, targetTab?: TabType) => {
    markNotificationRead(id);
    if (targetTab) {
      setActiveTab(targetTab);
      onClose();
    }
  };

  return (
    <div className="absolute right-0 top-14 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
      {/* Header */}
      <div className="p-3.5 px-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-[11px] font-bold bg-indigo-600 text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-50"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 px-3 bg-white text-xs font-medium">
        <button
          onClick={() => setFilter('all')}
          className={`py-2 px-3 border-b-2 transition-colors ${
            filter === 'all'
              ? 'border-indigo-600 text-indigo-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`py-2 px-3 border-b-2 transition-colors ${
            filter === 'unread'
              ? 'border-indigo-600 text-indigo-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {filteredList.length === 0 ? (
          <div className="py-8 text-center px-4">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">All caught up!</p>
            <p className="text-xs text-slate-400 mt-0.5">No unread notifications at this time.</p>
          </div>
        ) : (
          filteredList.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item.id, item.targetTab)}
              className={`p-3.5 transition-colors cursor-pointer flex gap-3 items-start ${
                item.read ? 'bg-white hover:bg-slate-50/80' : 'bg-indigo-50/40 hover:bg-indigo-50/80'
              }`}
            >
              <div className="mt-0.5 p-1.5 rounded-lg bg-white shadow-xs border border-slate-200/60 flex-shrink-0">
                {getIconForType(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className={`text-xs font-semibold truncate ${item.read ? 'text-slate-800' : 'text-indigo-950 font-bold'}`}>
                    {item.title}
                  </p>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">{item.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                  {item.message}
                </p>
              </div>
              {!item.read && (
                <div className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0 mt-1.5" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Browser Notification Permission request section */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <span className="truncate">
            {browserPermStatus === 'granted'
              ? 'Desktop alerts active'
              : browserPermStatus === 'denied'
              ? 'Browser alerts blocked'
              : 'Enable desktop reminders'}
          </span>
        </div>
        {browserPermStatus !== 'granted' && (
          <button
            onClick={handleRequestBrowserPermission}
            className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex-shrink-0"
          >
            Enable
          </button>
        )}
      </div>
    </div>
  );
};
