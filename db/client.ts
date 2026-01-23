import { MongoClient, ServerApiVersion } from "mongodb";

if (!process.env.NEXT_PUBLIC_MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

 
 

export const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI);

// export const db= client.db()


