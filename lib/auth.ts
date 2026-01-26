import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import schema from "@/db/schema";
import { db } from "@/db/drizzle";

if (!process.env.BETTER_AUTH_SECRET) {
	throw new Error('Invalid/Missing environment variable: "BETTER_AUTH_SECRET"');
}

export const auth = betterAuth({
	secret: process.env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			user: schema.user,
			session: schema.session,
			account: schema.account,
			verification: schema.verification,
			userRelations: schema.userRelations,
			sessionRelations: schema.sessionRelations,
			accountRelations: schema.accountRelations,
		},
	}),
	experimental: { joins: true },
	emailAndPassword: { enabled: true },
	plugins: [
		admin({ defaultRole: "user" }),
		nextCookies(),
	]
});