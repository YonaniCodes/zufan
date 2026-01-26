"use server"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Sign in a user with email and password
 */
export const signInAction = async (email: string, password: string) => {
  const response = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
    asResponse: true,
  });

  if (!response.ok) {
    const errorData = await response.json();
    return { error: errorData.message || "Failed to sign in", success: false };
  }

  return { success: true };
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
  return {session, isAdmin, isUser, role };
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
  const response = await auth.api.signUpEmail({
    body: {
      name: data.name,
      email: data.email,
      password: data.password,
      image: data.image,
      callbackURL: data.callbackURL,
    },
    asResponse: true,
  });

  if (!response.ok) {
    const errorData = await response.json();
    return { error: errorData.message || "Failed to create account", success: false };
  }

  return { success: true };
};
