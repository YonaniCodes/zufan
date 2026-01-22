import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

if (!process.env.NEXT_PUBLIC_MONGODB_URI) {
	throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI);
const db = client.db();

export const auth = betterAuth({
	database: mongodbAdapter(db, {
		client
	}),
  	emailAndPassword: { enabled: true },
});