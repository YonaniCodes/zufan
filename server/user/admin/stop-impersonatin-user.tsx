import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function stopImpersonatingApi() {
  try {
    const data = await auth.api.stopImpersonating({
      headers: await headers(),
    });
    return { success: true };
  } catch (err) {
    console.error("Failed to stop impersonating:", err);
    return { success: false, error: err };
  }
}
