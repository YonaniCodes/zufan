"use server"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function setUserRole(userId: string, role: "admin" | "user") {
  try {
    const data = await auth.api.setRole({
      body: {
        userId,
        role,
      },
      headers: await headers(),
    });

    return { success: true, data };
  } catch (err: any) {
    console.error("Unexpected error while setting role:", err);
    return { success: false, error: err.message || err };
  }
}
