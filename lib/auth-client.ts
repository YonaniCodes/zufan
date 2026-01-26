import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"

 const baseURL = process.env.NEXT_PUBLIC_URL?.split("#")[0].trim();

export const authClient = createAuthClient({
    ...(baseURL ? { baseURL } : {}),
    plugins: [adminClient()]
})

export const { signIn, signUp, signOut, useSession, admin } = authClient;
