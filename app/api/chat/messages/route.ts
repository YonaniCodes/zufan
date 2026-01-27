import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { chatMessage, chatSession } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// POST /api/chat/messages - Add message to session
export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { sessionId, id, role, content, citations } = body;

        if (!sessionId || !id || !role || !content) {
            return NextResponse.json(
                { error: "Session ID, message ID, role, and content are required" },
                { status: 400 }
            );
        }

        // Verify session ownership
        const sessionData = await db
            .select()
            .from(chatSession)
            .where(eq(chatSession.id, sessionId))
            .limit(1);

        if (sessionData.length === 0) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        if (sessionData[0].userId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Add message
        const newMessage = await db
            .insert(chatMessage)
            .values({
                id,
                sessionId,
                role,
                content,
                citations: citations ? JSON.stringify(citations) : null,
            })
            .returning();

        // Update session's updatedAt timestamp
        await db
            .update(chatSession)
            .set({ updatedAt: new Date() })
            .where(eq(chatSession.id, sessionId));

        return NextResponse.json(newMessage[0], { status: 201 });
    } catch (error) {
        console.error("Error adding chat message:", error);
        return NextResponse.json(
            { error: "Failed to add message" },
            { status: 500 }
        );
    }
}
