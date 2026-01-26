"use server";

import { auth } from "@/lib/auth";

export async function unbanUser(userId: string) {
  try {
    const data = await auth.api.unbanUser({
      body: {
        userId,
      }
    });

    return { success: true, data };
  } catch (err: any) {
    console.error("Unexpected error while unbanning user:", err);
    return { success: false, error: err.message || err };
  }
}
