"use server";
import { auth } from "@/lib/auth";
// import { APIError } from "better-auth";
import { headers } from "next/headers";

export default async function impersonateUserApi(userId: string) {
  try {
    // Call the API
    const data = await auth.api.impersonateUser({
      body: { userId },
      headers: await headers(),
    });

    // Success

    return { success: true, data };
  } catch (err) {
    // Handle known APIError separately if you want
    if (err) {
      console.error("Failed to impersonate user:", err);
      return { success: false, error: err };
    }

    // Other unexpected errors
    console.error("Unexpected error while impersonating user:", err);
    return { success: false, error: err };
  }
}
