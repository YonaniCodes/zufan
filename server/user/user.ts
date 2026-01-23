"use server"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Sign in a user with email and password
 */
export const signInAction = async (email: string, password: string) => {
  return await auth.api.signInEmail({
    body: {
      email,
      password,
    },
    asResponse: true,
  });
};

/**
 * Get the current user session
 */
export const getSessionAction = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
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
  return await auth.api.signUpEmail({
    body: {
      name: data.name,
      email: data.email,
      password: data.password,
      image: data.image,
      callbackURL: data.callbackURL,
    },
    asResponse: true,
  });
};
