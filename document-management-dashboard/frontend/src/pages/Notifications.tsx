import React, { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore.js';
import { Bell, Check, Clock, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { formatTimeAgo } from '../components/NotificationDropdown.js';
import { EmptyState } from '../components/EmptyState.js';

export const Notifications: React.FC = () => {
  const {
    notifications,
    notificationFilter,
    setNotificationFilter,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
  } = useAppStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filteredNotifs = notifications.filter((notif) => {
    if (notificationFilter === 'all') return true;
    return notif.type === notificationFilter;
  });

  const unreadCount = filteredNotifs.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-xl dark:bg-emerald-950/20 dark:text-emerald-400">
            <CheckCircle2 size={20} />
          </div>
        );
      case 'error':
        return (
          <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl dark:bg-rose-950/20 dark:text-rose-400">
            <AlertCircle size={20} />
          </div>
        );
      case 'info':
      default:
        return (
          <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl dark:bg-blue-950/20 dark:text-blue-400">
            <Info size={20} />
          </div>
        );
    }
  };

  const filterTabs: Array<{ id: 'all' | 'success' | 'error' | 'info'; label: string }> = [
    { id: 'all', label: 'All Logs' },
    { id: 'success', label: 'Success' },
    { id: 'error', label: 'Errors' },
    { id: 'info', label: 'Info' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">System Alerts</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review background process updates, upload history, and database operations events.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-850 hover:border-brand-500 hover:text-brand-500 dark:hover:text-brand-400 bg-white dark:bg-slate-900 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer shadow-sm hover:shadow transition-all"
          >
            <Check size={14} />
            Mark all read
          </button>
        )}
      </div>

      {/* Tabs Filter */}
      <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 gap-2 pb-px">
        {filterTabs.map((tab) => {
          const count = tab.id === 'all'
            ? notifications.length
            : notifications.filter(n => n.type === tab.id).length;

          return (
            <button
              key={tab.id}
              onClick={() => setNotificationFilter(tab.id)}
              className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                notificationFilter === tab.id
                  ? 'border-brand-500 text-brand-500'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                notificationFilter === tab.id
                  ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/30 dark:text-brand-400'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifs.length > 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
            {filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                className={`flex items-start gap-4 p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors ${
                  !notif.read ? 'bg-brand-50/10 dark:bg-brand-950/5' : ''
                }`}
              >
                {getIcon(notif.type)}

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <p className={`text-sm text-slate-700 dark:text-slate-300 leading-relaxed ${
                      !notif.read ? 'font-semibold text-slate-900 dark:text-white' : 'font-medium'
                    }`}>
                      {notif.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                      <Clock size={12} />
                      {formatTimeAgo(notif.createdAt)}
                    </span>
                    {!notif.read && (
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
                    )}
                  </div>
                </div>

                {!notif.read && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 hover:border-brand-500 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-350 hover:text-brand-500 dark:hover:text-brand-400 transition-colors cursor-pointer"
                    title="Mark as read"
                  >
                    <Check size={12} />
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No alerts to display"
            description={
              notificationFilter === 'all'
                ? 'Your log is empty. Notifications will show up here.'
                : `We couldn't find any notifications with status "${notificationFilter}".`
            }
            icon={<Bell size={40} className="text-slate-350 dark:text-slate-500" />}
          />
        )}
      </div>
    </div>
  );
};
export default Notifications;
