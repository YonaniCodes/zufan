"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
      },
      headers: await headers(),
    });
 
    return { success: true, data };
  } catch (err: any) {
    console.error("Unexpected error while banning user:", err);
    return { success: false, error: err.message || err };
  }
}
