This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

***

# Backend API Requirements

This section documents the API endpoints and data models required by the frontend application. The backend implementation should adhere to these contracts to ensure seamless integration with the 'Zufan' frontend.

## Overview
- **Base URL**: `/api`
- **Content-Type**: `application/json`
- **Authentication**: Bearer Token (if applicable)

## Data Models

### Document
Represents a legal document uploaded to the system.
```typescript
interface Document {
  id: string;               // Unique identifier (e.g., "m5gr84i9")
  name: string;             // Original filename (e.g., "NDA_Alpha_Corp_v2.pdf")
  type: "Contract" | "Case Law" | "Statute" | "Pleading"; // Classification
  status: "Indexed" | "Processing" | "Error"; // RAG Indexing status
  date: string;             // ISO Date string (e.g., "2024-04-12")
  size: string;             // Human readable size (e.g., "2.4 MB")
  jurisdiction?: string;    // e.g., "us-federal", "eu-gdpr"
  caseReferenceId?: string; // Optional internal case ID
}
```

### Message
Represents a chat message in the conversation history.
```typescript
interface Message {
  role: "user" | "assistant";
  content: string; // The text content of the message
  citations?: { 
    source: string;  // Title/Name of the source document
    content: string; // Excerpt used for the answer
  }[];
}
```

### DashboardStats
Aggregated statistics for the admin dashboard.
```typescript
interface DashboardStats {
  totalDocuments: number;
  totalVectors: number;
  lastSyncTime: string; // ISO timestamp or relative string
  storageUsed: string;  // Human readable string
  storagePending: string;
}
```

---

## API Endpoints

### 1. Artificial Intelligence (RAG Chat)

#### `POST /api/chat`
Streamed or request/response endpoint for the legal assistant chat.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "What is the penalty for contract breach?" }
  ]
}
```

**Response:**
Returns a streamed response or a JSON object matching the `Message` interface.

---

### 2. Document Management

#### `POST /api/upload`
Uploads a document for processing and indexing.

**Request:** `FormData`
- `file`: File object (PDF, DOCX, TXT)
- `jurisdiction`: string
- `caseReferenceId`: string
- `documentType`: string

**Response:**
```json
{
  "message": "Upload successful",
  "documentId": "generated-id-123"
}
```

#### `GET /api/documents`
Retrieves a paginated list of documents.

**Query Parameters:**
- `page`: Page number (default 1)
- `limit`: Items per page (default 10)
- `search`: Filter by filename (optional)

**Response:**
```json
{
  "data": [ /* Array of Document objects */ ],
  "meta": {
    "total": 1284,
    "page": 1,
    "limit": 10
  }
}
```

#### `DELETE /api/documents/:id`
Deletes a document and its associated vector embeddings.

**Response:** `200 OK`

#### `POST /api/documents/:id/reindex`
Triggers the RAG pipeline to re-process and re-index a specific document.

**Response:**
```json
{ "status": "Processing", "jobId": "job-abc-123" }
```

---

### 3. Dashboard

#### `GET /api/stats`
Fetches high-level metrics for the admin dashboard cards.

**Response:**
```json
{
  "totalDocuments": 1284,
  "vectorCount": 84392,
  "lastSync": "2024-05-20T14:30:00Z",
  "storage": {
    "used": "4.2 GB",
    "pending": "201 MB"
  }
}
```
