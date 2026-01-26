"use server";

import { UserType, ListUsersQuery, NormalizedListUsersResponse } from "@/types/user";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const listUsers = async ({
  query = {},
}: { query?: ListUsersQuery } = {}): Promise<NormalizedListUsersResponse> => {
  const { limit = 100, offset = 0 } = query;

  try {
    const data = await auth.api.listUsers({
      query,
      headers: await headers(),
    });

    // Normalize the response here
    const normalized: NormalizedListUsersResponse = {
      users: (data as any)?.users ?? [],
      total: (data as any)?.total ?? 0,
      limit: (data as any)?.limit ?? limit, // force TS to see it exists
      offset: (data as any)?.offset ?? offset,
    };

    return normalized;
  } catch (err: any) {
    console.error("Error fetching users:", err);
    return {
      users: [],
      total: 0,
      limit,
      offset,
    };
  }
};

export default listUsers;
