"use server";

import { auth } from "@/lib/auth";

export async function removeUser(userId: string) {
  try {
    const data = await auth.api.removeUser({ body: { userId } });

    return { success: true, data };
  } catch (err: any) {
    console.error("Unexpected error while removing user:", err);
    return { success: false, error: err.message || err };
  }
}
