"use server";

import { auth } from "@/lib/auth";

export async function banUser(
  userId: string,
  banReason?: string,
  banExpiresIn?: number // in seconds
) {
  try {
    const data = await auth.api.banUser({
      body: {
        userId,
        banReason,
        banExpiresIn,
      }
    });
 
    return { success: true, data };
  } catch (err: any) {
    console.error("Unexpected error while banning user:", err);
    return { success: false, error: err.message || err };
  }
}
