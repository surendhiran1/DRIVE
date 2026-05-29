import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { emitEvent } from '../services/socketService.js';

export const uploadFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      return res.status(400).json({ success: false, error: 'No files uploaded' });
    }

    // Support single file if uploaded under different field, but we assume "files" or array is mapped
    const files = (Array.isArray(req.files) ? req.files : Object.values(req.files).flat()) as Express.Multer.File[];

    // Validate that all files are PDFs (backup validation)
    for (const file of files) {
      if (file.mimetype !== 'application/pdf') {
        return res.status(400).json({ success: false, error: 'Only PDF files are allowed!' });
      }
    }

    const totalFiles = files.length;

    if (totalFiles <= 3) {
      // Process synchronously
      const savedDocs = [];
      for (const file of files) {
        const doc = await prisma.document.create({
          data: {
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            uploadStatus: 'complete',
            storagePath: file.path,
          },
        });
        savedDocs.push(doc);

        // Store notification in DB
        const notification = await prisma.notification.create({
          data: {
            message: `Document "${file.originalname}" uploaded successfully.`,
            type: 'success',
          },
        });
        emitEvent('notification_created', notification);
      }

      // Notify clients
      emitEvent('upload_complete', {
        message: `${totalFiles} file(s) uploaded successfully`,
        documents: savedDocs
      });

      return res.status(200).json({
        success: true,
        message: 'Upload completed',
        documents: savedDocs,
      });
    } else {
      // Smart bulk upload logic (> 3 files) -> Process asynchronously in the background
      const session = await prisma.uploadSession.create({
        data: {
          totalFiles,
          completedFiles: 0,
          status: 'processing',
        },
      });

      // Background processing
      (async () => {
        try {
          const savedDocs = [];
          for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Artificial progress delay to simulate scanner processing/analysis and make the UI look outstanding
            await new Promise((resolve) => setTimeout(resolve, 800));

            const doc = await prisma.document.create({
              data: {
                filename: file.filename,
                originalName: file.originalname,
                size: file.size,
                mimetype: file.mimetype,
                uploadStatus: 'complete',
                storagePath: file.path,
              },
            });
            savedDocs.push(doc);

            // Update session status
            await prisma.uploadSession.update({
              where: { id: session.id },
              data: { completedFiles: i + 1 },
            });

            // Emit progress event
            emitEvent('upload_progress', {
              sessionId: session.id,
              completedFiles: i + 1,
              totalFiles,
              filename: file.originalname,
            });
          }

          // Complete session in DB
          await prisma.uploadSession.update({
            where: { id: session.id },
            data: { status: 'complete' },
          });

          // Create notification in DB
          const notification = await prisma.notification.create({
            data: {
              message: `Bulk upload complete: ${totalFiles} files processed successfully.`,
              type: 'success',
            },
          });

          emitEvent('notification_created', notification);
          emitEvent('upload_complete', {
            sessionId: session.id,
            message: `${totalFiles} files uploaded successfully`,
            documents: savedDocs,
          });
        } catch (error: any) {
          console.error('Bulk upload background error:', error);
          await prisma.uploadSession.update({
            where: { id: session.id },
            data: { status: 'failed' },
          });

          emitEvent('upload_failed', {
            sessionId: session.id,
            message: `Bulk upload of ${totalFiles} files failed: ${error.message || 'Unknown processing error'}`
          });
        }
      })();

      return res.status(202).json({
        success: true,
        message: `Upload in progress — processing ${totalFiles} files in background`,
        sessionId: session.id,
      });
    }
  } catch (error) {
    next(error);
  }
};
