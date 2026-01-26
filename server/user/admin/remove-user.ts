"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function removeUser(userId: string) {
  try {
    const data = await auth.api.removeUser({
      body: { userId },
      headers: await headers(),
    });

    return { success: true, data };
  } catch (err: any) {
    console.error("Unexpected error while removing user:", err);
    return { success: false, error: err.message || err };
  }
}
