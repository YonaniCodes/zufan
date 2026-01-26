"use server"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Sign in a user with email and password
 */
export const signInAction = async (email: string, password: string) => {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });

    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Failed to sign in", success: false };
  }
};

/**
 * Get the current user session
 */
export const getSessionAction = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user= session?.user
  const isAdmin= user?.role === "admin";
  const isUser= user?.role === "user";
  const role= user?.role;
  
	console.log("Session:", session);
	console.log("User role:", session?.user?.role); 
  return {session, isAdmin, isUser, role , userId:user?.id };
 
};



/**
 * Sign up a new user with email and password
 */
export const signUpAction = async (data: {
  name: string;
  email: string;
  password: string;
  image?: string;
  callbackURL?: string;
}) => {
  try {
    await auth.api.signUpEmail({
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
        image: data.image,
        callbackURL: data.callbackURL,
      },
      headers: await headers(),
    });

    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Failed to create account", success: false };
  }
};
