export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatPayload {
    messages: Message[];
    sessionId?: string;
    userId?: string;
}

export interface Session {
    sessionId: string;
    title?: string;
}

export interface DocumentStats {
    filename: string;
    type: 'PDF' | 'Chunked';
    chunks: number;
    total_chars: number;
    page_count: number;
}

export interface VectorStats {
    total_vectors: number;
    index_size: string;
    model_info: string;
}

export interface SearchResult {
    content: string;
    score: number;
    metadata: any;
}

export const api = {
    // Chat & Conversation
    async chatStream(payload: ChatPayload, onChunk: (chunk: string) => void) {
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Failed to send message');

        const reader = response.body?.getReader();
        if (!reader) throw new Error('Response body is null');

        const decoder = new TextDecoder();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            onChunk(chunk);
        }
    },

    // Knowledge Base
    async uploadFile(file: File): Promise<any> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${API_BASE_URL}/api/upload/file`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) throw new Error('Upload failed');
        return response.json();
    },

    async uploadChunks(chunks: any[]): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/upload/chunks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(chunks),
        });
        if (!response.ok) throw new Error('Chunk indexing failed');
        return response.json();
    },

    async getDocuments(): Promise<DocumentStats[]> {
        const response = await fetch(`${API_BASE_URL}/api/documents`);
        if (!response.ok) throw new Error('Failed to fetch documents');
        return response.json();
    },

    async deleteDocument(filename: string): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/documents/${encodeURIComponent(filename)}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete document');
        return response.json();
    },

    // Vector Management
    async getVectorStats(): Promise<VectorStats> {
        const response = await fetch(`${API_BASE_URL}/api/vector/stats`);
        if (!response.ok) throw new Error('Failed to fetch vector stats');
        return response.json();
    },

    async vectorSearch(query: string, k: number = 5): Promise<SearchResult[]> {
        const response = await fetch(`${API_BASE_URL}/api/vector/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, k }),
        });
        if (!response.ok) throw new Error('Vector search failed');
        return response.json();
    },

    async clearVectorStore(): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/vector/clear`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to clear vector store');
        return response.json();
    },

    // Audit Logs
    async getAuditLogs(limit: number = 50): Promise<any[]> {
        const response = await fetch(`${API_BASE_URL}/api/audit/logs?limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch audit logs');
        return response.json();
    },

    async clearAuditLogs(): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/audit/logs`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to clear audit logs');
        return response.json();
    },

    // Chat Session Management
    async getChatSessions(): Promise<any[]> {
        const response = await fetch('/api/chat/sessions');
        if (!response.ok) throw new Error('Failed to fetch chat sessions');
        return response.json();
    },

    async getChatSession(id: string): Promise<any> {
        const response = await fetch(`/api/chat/sessions/${id}`);
        if (!response.ok) throw new Error('Failed to fetch chat session');
        return response.json();
    },

    async createChatSession(id: string, title: string): Promise<any> {
        const response = await fetch('/api/chat/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, title }),
        });
        if (!response.ok) throw new Error('Failed to create chat session');
        return response.json();
    },

    async deleteChatSession(id: string): Promise<any> {
        const response = await fetch(`/api/chat/sessions/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete chat session');
        return response.json();
    },

    async addChatMessage(sessionId: string, id: string, role: 'user' | 'assistant', content: string, citations?: any[]): Promise<any> {
        const response = await fetch('/api/chat/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, id, role, content, citations }),
        });
        if (!response.ok) throw new Error('Failed to add chat message');
        return response.json();
    },
};
