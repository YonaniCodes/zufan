import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { chatSession, chatMessage } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/chat/sessions/:id - Get session with messages
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Get session
        const sessionData = await db
            .select()
            .from(chatSession)
            .where(eq(chatSession.id, id))
            .limit(1);

        if (sessionData.length === 0) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        // Verify ownership
        if (sessionData[0].userId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Get messages
        const messages = await db
            .select()
            .from(chatMessage)
            .where(eq(chatMessage.sessionId, id))
            .orderBy(asc(chatMessage.createdAt));

        // Parse citations from JSON string
        const parsedMessages = messages.map((msg) => ({
            ...msg,
            citations: msg.citations ? JSON.parse(msg.citations) : undefined,
        }));

        return NextResponse.json({
            ...sessionData[0],
            messages: parsedMessages,
        });
    } catch (error) {
        console.error("Error fetching chat session:", error);
        return NextResponse.json(
            { error: "Failed to fetch session" },
            { status: 500 }
        );
    }
}

// DELETE /api/chat/sessions/:id - Delete session
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Get session to verify ownership
        const sessionData = await db
            .select()
            .from(chatSession)
            .where(eq(chatSession.id, id))
            .limit(1);

        if (sessionData.length === 0) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        if (sessionData[0].userId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Delete session (messages will be cascade deleted)
        await db.delete(chatSession).where(eq(chatSession.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting chat session:", error);
        return NextResponse.json(
            { error: "Failed to delete session" },
            { status: 500 }
        );
    }
}
