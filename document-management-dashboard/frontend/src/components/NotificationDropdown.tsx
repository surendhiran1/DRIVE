import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, CheckSquare, Clock, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { Notification } from '../store/useAppStore.js';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

// Helper to format date in a readable format
export const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadNotifications = notifications.filter(n => !n.read);
  const displayNotifications = notifications.slice(0, 5); // show max 5

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'error':
        return <AlertCircle size={16} className="text-rose-500" />;
      case 'info':
      default:
        return <Info size={16} className="text-blue-500" />;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden transition-all transform origin-top-right scale-100"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Notifications</h3>
          {unreadNotifications.length > 0 && (
            <p className="text-[11px] text-brand-600 dark:text-brand-400 font-medium">
              {unreadNotifications.length} unread
            </p>
          )}
        </div>
        {unreadNotifications.length > 0 && (
          <button
            onClick={() => {
              onMarkAllRead();
              onClose();
            }}
            className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 font-medium cursor-pointer transition-colors"
          >
            <CheckSquare size={12} />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
        {displayNotifications.length > 0 ? (
          displayNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start gap-3 p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                !notif.read ? 'bg-brand-50/20 dark:bg-brand-950/10' : ''
              }`}
            >
              <div className="mt-0.5">{getIcon(notif.type)}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs text-slate-700 dark:text-slate-350 leading-relaxed ${
                  !notif.read ? 'font-medium text-slate-900 dark:text-white' : ''
                }`}>
                  {notif.message}
                </p>
                <span className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                  <Clock size={10} />
                  {formatTimeAgo(notif.createdAt)}
                </span>
              </div>
              {!notif.read && (
                <button
                  onClick={() => onMarkRead(notif.id)}
                  title="Mark as read"
                  className="p-1 rounded-full text-slate-300 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Check size={12} />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center px-4">
            <Bell size={24} className="text-slate-300 dark:text-slate-600 mb-2 animate-bounce" />
            <p className="text-xs font-semibold text-slate-655 dark:text-slate-400">All caught up!</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 max-w-[200px] mt-0.5">
              You will receive alerts here when upload tasks finish.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <Link
        to="/notifications"
        onClick={onClose}
        className="block text-center py-2.5 text-xs font-semibold text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-slate-800 border-t border-slate-100 dark:border-slate-800 transition-colors"
      >
        See all notifications
      </Link>
    </div>
  );
};
export default NotificationDropdown;
