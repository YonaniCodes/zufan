import { auth } from "@/lib/auth";

export async function updateUserPassword(userId: string, newPassword: string) {
  try {
    const data = await auth.api.setUserPassword({
      body: {
        userId,
        newPassword,
      }
    });

    return { success: true, data };
  } catch (err: any) {
    console.error("Unexpected error while updating password:", err);
    return { success: false, error: err.message || err };
  }
}
