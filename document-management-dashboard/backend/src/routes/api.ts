import { Router } from 'express';
import { uploadFiles } from '../controllers/uploadController.js';
import { getDocuments, downloadDocument } from '../controllers/documentController.js';
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController.js';
import { uploadMiddleware } from '../middleware/upload.js';

const router = Router();

// Upload Routes
// Multer middleware parses files array with field name "files" (up to 20 files per request)
router.post('/upload', uploadMiddleware.array('files', 20), uploadFiles);

// Document Routes
router.get('/documents', getDocuments);
router.get('/documents/:id/download', downloadDocument);

// Notification Routes
router.get('/notifications', getNotifications);
router.patch('/notifications/read-all', markAllAsRead);
router.patch('/notifications/:id/read', markAsRead);

// Health Check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

export default router;
