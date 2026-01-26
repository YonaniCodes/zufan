import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js";

if (!process.env.BETTER_AUTH_SECRET) {
	throw new Error('Invalid/Missing environment variable: "BETTER_AUTH_SECRET"');
}

if (!process.env.NEXT_PUBLIC_MONGODB_URI) {
	throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI);
const db = client.db();

export const auth = betterAuth({
	secret: process.env.BETTER_AUTH_SECRET,
	database: mongodbAdapter(db, {
		client
	}),
	experimental: { joins: true },
	emailAndPassword: { enabled: true },
	plugins: [
		admin({ defaultRole: "user" }),
		nextCookies(),
	]
});