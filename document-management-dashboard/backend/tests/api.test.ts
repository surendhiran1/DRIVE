import { jest, describe, it, expect, afterAll } from '@jest/globals';
import request from 'supertest';
import { app, server } from '../src/index.js';

// Mock database layer
jest.mock('../src/config/db.js', () => ({
  prisma: {
    document: {
      findMany: jest.fn().mockImplementation(() => Promise.resolve([
        {
          id: 'test-doc-id',
          filename: 'doc-123.pdf',
          originalName: 'MockTestDocument.pdf',
          size: 20485,
          mimetype: 'application/pdf',
          uploadStatus: 'complete',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          storagePath: '/mock/uploads/doc-123.pdf',
        }
      ])),
      create: jest.fn().mockImplementation((args: any) => Promise.resolve({
        id: 'new-doc-id',
        ...args.data
      }))
    },
    notification: {
      findMany: jest.fn().mockImplementation(() => Promise.resolve([
        {
          id: 'test-notif-id',
          message: 'Bulk upload complete: 4 files processed.',
          type: 'success',
          read: false,
          createdAt: new Date().toISOString()
        }
      ])),
      update: jest.fn().mockImplementation((args: any) => Promise.resolve({
        id: args.where.id,
        read: true
      })),
      updateMany: jest.fn().mockImplementation(() => Promise.resolve({ count: 1 })),
      create: jest.fn().mockImplementation((args: any) => Promise.resolve({
        id: 'new-notif-id',
        ...args.data
      }))
    },
    uploadSession: {
      create: jest.fn().mockImplementation((args: any) => Promise.resolve({
        id: 'session-id',
        ...args.data
      })),
      update: jest.fn().mockImplementation((args: any) => Promise.resolve({
        id: args.where.id,
        ...args.data
      }))
    }
  }
}));

describe('Document Management API Test Suite', () => {
  afterAll((done) => {
    server.close(done);
  });

  it('GET /api/health should respond with OK and uptime info', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
  });

  it('GET /api/documents should respond with the mocked documents registry', async () => {
    const res = await request(app).get('/api/documents');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.documents)).toBe(true);
    expect(res.body.documents[0].originalName).toBe('MockTestDocument.pdf');
  });

  it('GET /api/notifications should return the mocked notification array', async () => {
    const res = await request(app).get('/api/notifications');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.notifications[0].type).toBe('success');
  });

  it('PATCH /api/notifications/:id/read should mark a notification as read', async () => {
    const res = await request(app).patch('/api/notifications/test-notif-id/read');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.notification.read).toBe(true);
  });

  it('PATCH /api/notifications/read-all should set all notifications as read', async () => {
    const res = await request(app).patch('/api/notifications/read-all');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
