import { create } from 'zustand';
import api from '../services/api.js';
import { socket } from '../services/socket.js';
import toast from 'react-hot-toast';

export interface Document {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  uploadStatus: 'pending' | 'uploading' | 'complete' | 'failed';
  createdAt: string;
  updatedAt: string;
  storagePath: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  read: boolean;
  createdAt: string;
}

export interface UploadSession {
  id: string;
  totalFiles: number;
  completedFiles: number;
  status: 'pending' | 'processing' | 'complete' | 'failed';
  createdAt: string;
}

export interface UploadProgressItem {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'failed';
  speed?: string; // e.g. "2.4 MB/s"
}

interface AppState {
  documents: Document[];
  notifications: Notification[];
  activeSession: UploadSession | null;
  uploadProgress: { [key: string]: UploadProgressItem };
  darkMode: boolean;
  searchQuery: string;
  notificationFilter: 'all' | 'success' | 'error' | 'info';
  loadingDocs: boolean;
  loadingNotifs: boolean;

  fetchDocuments: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  uploadFiles: (files: File[]) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  toggleDarkMode: () => void;
  setSearchQuery: (query: string) => void;
  setNotificationFilter: (filter: 'all' | 'success' | 'error' | 'info') => void;
  clearUploadProgress: () => void;
  initializeSocketListeners: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  documents: [],
  notifications: [],
  activeSession: null,
  uploadProgress: {},
  darkMode: localStorage.getItem('theme') === 'dark',
  searchQuery: '',
  notificationFilter: 'all',
  loadingDocs: false,
  loadingNotifs: false,

  fetchDocuments: async () => {
    set({ loadingDocs: true });
    try {
      const response = await api.get('/documents');
      if (response.data.success) {
        set({ documents: response.data.documents });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch documents');
    } finally {
      set({ loadingDocs: false });
    }
  },

  fetchNotifications: async () => {
    set({ loadingNotifs: true });
    try {
      const response = await api.get('/notifications');
      if (response.data.success) {
        set({ notifications: response.data.notifications });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch notifications');
    } finally {
      set({ loadingNotifs: false });
    }
  },

  uploadFiles: async (files: File[]) => {
    const totalFiles = files.length;
    if (totalFiles === 0) return;

    if (totalFiles <= 3) {
      // Synchronous concurrent uploads for <= 3 files
      const items: { [key: string]: UploadProgressItem } = {};
      files.forEach((file) => {
        const id = Math.random().toString(36).substring(7);
        items[id] = {
          id,
          name: file.name,
          size: file.size,
          progress: 0,
          status: 'pending',
        };
      });
      set({ uploadProgress: items });

      // Run uploads concurrently
      const uploadPromises = Object.keys(items).map(async (id, idx) => {
        const file = files[idx];
        const formData = new FormData();
        formData.append('files', file);

        set((state) => ({
          uploadProgress: {
            ...state.uploadProgress,
            [id]: { ...state.uploadProgress[id], status: 'uploading' },
          },
        }));

        let lastLoaded = 0;
        let lastTime = Date.now();

        try {
          await api.post('/upload', formData, {
            onUploadProgress: (progressEvent) => {
              const total = progressEvent.total || file.size;
              const current = progressEvent.loaded;
              const percent = Math.round((current * 100) / total);

              // Calculate speed
              const currentTime = Date.now();
              const duration = (currentTime - lastTime) / 1000; // seconds
              let speedStr = '';
              if (duration > 0.1) {
                const loadedDiff = current - lastLoaded;
                const speed = loadedDiff / duration; // bytes per second
                if (speed > 1024 * 1024) {
                  speedStr = `${(speed / (1024 * 1024)).toFixed(1)} MB/s`;
                } else if (speed > 1024) {
                  speedStr = `${(speed / 1024).toFixed(1)} KB/s`;
                }
                lastLoaded = current;
                lastTime = currentTime;
              }

              set((state) => ({
                uploadProgress: {
                  ...state.uploadProgress,
                  [id]: {
                    ...state.uploadProgress[id],
                    progress: percent,
                    speed: speedStr || state.uploadProgress[id].speed,
                  },
                },
              }));
            },
          });

          set((state) => ({
            uploadProgress: {
              ...state.uploadProgress,
              [id]: { ...state.uploadProgress[id], status: 'complete', progress: 100 },
            },
          }));
        } catch (error: any) {
          set((state) => ({
            uploadProgress: {
              ...state.uploadProgress,
              [id]: { ...state.uploadProgress[id], status: 'failed' },
            },
          }));
          toast.error(`Failed to upload ${file.name}: ${error.response?.data?.error || error.message}`);
        }
      });

      await Promise.all(uploadPromises);
      // Refresh documents
      await get().fetchDocuments();
    } else {
      // Smart bulk upload logic (> 3 files)
      toast.loading(`Upload in progress — processing ${totalFiles} files in background`, {
        duration: 4000,
        icon: '⏳',
      });

      // Show temporary initial status for files in progress center
      const items: { [key: string]: UploadProgressItem } = {};
      files.forEach((file) => {
        const id = Math.random().toString(36).substring(7);
        items[id] = {
          id,
          name: file.name,
          size: file.size,
          progress: 0,
          status: 'uploading',
        };
      });
      set({ uploadProgress: items });

      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      try {
        // Send files to the backend. The backend will return a 202 session token
        const response = await api.post('/upload', formData, {
          onUploadProgress: (progressEvent) => {
            // Track the upload status of the HTTP request itself
            const total = progressEvent.total || 1;
            const percent = Math.round((progressEvent.loaded * 100) / total);
            
            // Pro-rate progress for items
            set((state) => {
              const updated = { ...state.uploadProgress };
              Object.keys(updated).forEach((id) => {
                updated[id].progress = percent;
              });
              return { uploadProgress: updated };
            });
          }
        });

        if (response.status === 202) {
          const { sessionId } = response.data;
          set({
            activeSession: {
              id: sessionId,
              totalFiles,
              completedFiles: 0,
              status: 'processing',
              createdAt: new Date().toISOString(),
            },
          });
        }
      } catch (error: any) {
        set({ uploadProgress: {} });
        toast.error(`Bulk upload failed: ${error.response?.data?.error || error.message}`);
      }
    }
  },

  markAsRead: async (id: string) => {
    try {
      const response = await api.patch(`/notifications/${id}/read`);
      if (response.data.success) {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      }
    } catch (error: any) {
      toast.error('Failed to mark notification as read');
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await api.patch('/notifications/read-all');
      if (response.data.success) {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
        toast.success('All notifications marked as read');
      }
    } catch (error: any) {
      toast.error('Failed to mark all notifications as read');
    }
  },

  toggleDarkMode: () => {
    const dark = !get().darkMode;
    set({ darkMode: dark });
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  
  setNotificationFilter: (filter) => set({ notificationFilter: filter }),
  
  clearUploadProgress: () => set({ uploadProgress: {} }),

  initializeSocketListeners: () => {
    // Unsubscribe from any active socket events first to prevent duplicate registrations
    socket.off('notification_created');
    socket.off('upload_progress');
    socket.off('upload_complete');
    socket.off('upload_failed');

    // Realtime notification creation
    socket.on('notification_created', (notification: Notification) => {
      set((state) => ({
        notifications: [notification, ...state.notifications],
      }));
      
      // Beautiful toast alerting the user
      const icon = notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : 'ℹ️';
      toast(notification.message, { icon });
    });

    // Realtime bulk progress increments
    socket.on('upload_progress', (data: { sessionId: string; completedFiles: number; totalFiles: number }) => {
      const { sessionId, completedFiles, totalFiles } = data;
      set((state) => {
        if (state.activeSession?.id === sessionId) {
          return {
            activeSession: {
              ...state.activeSession,
              completedFiles,
            },
          };
        }
        return {};
      });
    });

    // Realtime bulk complete
    socket.on('upload_complete', (data: { sessionId?: string; message: string }) => {
      const { sessionId } = data;
      set((state) => {
        if (!sessionId || state.activeSession?.id === sessionId) {
          // Clear active session and refresh data
          setTimeout(() => {
            get().fetchDocuments();
            get().fetchNotifications();
          }, 500);
          return {
            activeSession: null,
            uploadProgress: {},
          };
        }
        return {};
      });
      toast.success(data.message, { duration: 5000 });
    });

    // Realtime bulk failure
    socket.on('upload_failed', (data: { sessionId: string; message: string }) => {
      set((state) => {
        if (state.activeSession?.id === data.sessionId) {
          return {
            activeSession: null,
            uploadProgress: {},
          };
        }
        return {};
      });
      toast.error(data.message);
    });
  },
}));
