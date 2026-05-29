import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import fs from 'fs';
import path from 'path';

export const getDocuments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const documents = await prisma.document.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    next(error);
  }
};

export const downloadDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const doc = await prisma.document.findUnique({
      where: { id },
    });

    if (!doc) {
      res.statusCode = 404;
      throw new Error('Document not found');
    }

    if (!fs.existsSync(doc.storagePath)) {
      res.statusCode = 404;
      throw new Error('File does not exist on storage disk');
    }

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(doc.originalName)}"`);
    res.setHeader('Content-Type', doc.mimetype);

    return res.download(doc.storagePath, doc.originalName, (err) => {
      if (err) {
        console.error('File download error:', err);
        if (!res.headersSent) {
          return res.status(500).json({ success: false, error: 'Could not download file' });
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
