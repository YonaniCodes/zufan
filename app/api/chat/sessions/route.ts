import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { chatSession, chatMessage } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/chat/sessions - List all user's chat sessions
export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sessions = await db
            .select({
                id: chatSession.id,
                title: chatSession.title,
                createdAt: chatSession.createdAt,
                updatedAt: chatSession.updatedAt,
            })
            .from(chatSession)
            .where(eq(chatSession.userId, session.user.id))
            .orderBy(desc(chatSession.updatedAt));

        return NextResponse.json(sessions);
    } catch (error) {
        console.error("Error fetching chat sessions:", error);
        return NextResponse.json(
            { error: "Failed to fetch sessions" },
            { status: 500 }
        );
    }
}

// POST /api/chat/sessions - Create new chat session
export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { title, id } = body;

        if (!title || !id) {
            return NextResponse.json(
                { error: "Title and ID are required" },
                { status: 400 }
            );
        }

        const newSession = await db
            .insert(chatSession)
            .values({
                id,
                userId: session.user.id,
                title,
            })
            .returning();

        return NextResponse.json(newSession[0], { status: 201 });
    } catch (error) {
        console.error("Error creating chat session:", error);
        return NextResponse.json(
            { error: "Failed to create session" },
            { status: 500 }
        );
    }
}
