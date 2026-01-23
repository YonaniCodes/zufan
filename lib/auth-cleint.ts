import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"
export const { signIn, signUp, useSession }  = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.NEXT_PUBLIC_URL,
    plugins: [adminClient()]
} )