# DocuFlow — Document Management Dashboard

DocuFlow is a production-quality full-stack Document Management Dashboard prototype. It provides clean file uploading UI (PDF only), robust bulk upload background processing, real-time feedback using Socket.IO, database auditing persistence, clean metrics dashboards, and Docker compliance.

---

## 🏗️ Architecture Overview

The system is decoupled into two primary zones:

1. **Frontend (Client)**: Built with **React + Vite + TypeScript**. It utilizes **TailwindCSS** for styling, **Zustand** for global client states, **Socket.IO-Client** for real-time notifications subscription, and **Framer Motion** for micro-interactions.
2. **Backend (Server)**: Built with **Node.js + Express + TypeScript**. It implements **Prisma ORM** for PostgreSQL data persistence, **Multer** for filesystem PDF storage limits, and **Socket.IO** for event broadcasts.

---

## 🗄️ Database Schema (Prisma / PostgreSQL)

The schema defines three fundamental structures:

*   **`Document`**: Records metadata for each uploaded file on the server.
    *   `id` (UUID): Primary key.
    *   `filename`: Stored file system name.
    *   `originalName`: Client source file name.
    *   `size` (Int): Byte size of the document.
    *   `mimetype`: Content validation identifier (validated as `application/pdf`).
    *   `uploadStatus` (String): Status code (`pending`, `uploading`, `complete`, `failed`).
    *   `createdAt` & `updatedAt`: Timestamps.
    *   `storagePath`: Path to the local disk file.

*   **`Notification`**: Auditable server event logs (Success/Error/Info metrics).
    *   `id` (UUID): Primary key.
    *   `message`: Description of the action (e.g. bulk success message).
    *   `type`: Type category (`success`, `error`, `info`).
    *   `read` (Boolean): Determines read/unread badge statuses.
    *   `createdAt`: Timestamp.

*   **`UploadSession`**: Monitors background task percentages for uploads containing more than 3 files.
    *   `id` (UUID): Primary key.
    *   `totalFiles`: Total count of files in the batch request.
    *   `completedFiles`: Iterative processing increment index.
    *   `status`: Status label (`pending`, `processing`, `complete`, `failed`).
    *   `createdAt`: Timestamp.

---

## ⚡ Socket.IO Event Sequences

```
[Client]                                                         [Express API]
   |                                                                   |
   |--- POST /api/upload (Multi multipart PDFs > 3 files) ------------->|
   |<-- 202 Accepted (Response includes sessionId) ---------------------|
   |                                                                   |
   |                                                    [Async Background Worker starts...]
   |                                                                   |
   |<-- (Socket.IO event) 'upload_progress' {sessionId, completed} ----|
   |<-- (Socket.IO event) 'upload_progress' {sessionId, completed} ----|
   |                                                                   |
   |                                                    [All files written to disk & DB]
   |                                                                   |
   |<-- (Socket.IO event) 'notification_created' {Notification} -------|
   |<-- (Socket.IO event) 'upload_complete' {sessionId} ---------------|
   V                                                                   V
```

---

## 🛠️ Environment Variables

### Backend Configuration (`backend/.env`)

```ini
PORT=5001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/document_dashboard?schema=public
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 Quick Start Instructions

### Local Development (Direct Run)

#### 1. Setup PostgreSQL Database
Ensure you have PostgreSQL running. Create a database named `document_dashboard` or use Docker to start a container:
```bash
docker run --name pg_docuflow -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgrespassword -e POSTGRES_DB=document_dashboard -p 5432:5432 -d postgres:15-alpine
```

#### 2. Start the Backend Server
```bash
cd backend
npm install
npx prisma db push # push schema to PostgreSQL
npm run dev
```
The server will start on `http://localhost:5001`.

#### 3. Start the Frontend Client
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🐳 Docker Deployment (Docker Compose)

To spin up the entire application suite including PostgreSQL, run the following command at the root directory:

```bash
docker-compose up --build
```

This will run:
*   **Database**: PostgreSQL listening on host port `5432`
*   **Backend Server**: Node API on host port `5001`
*   **Frontend Client**: React app served on host port `5173`

---

## 🧪 Running Tests

### Backend API tests (Jest & Supertest)
```bash
cd backend
npm run test
```

### Frontend component tests (Vitest & RTL)
```bash
cd frontend
npm run test
```
