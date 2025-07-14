import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"
import type { AuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
 
const secret = process.env.AUTH_SECRET
 
if (!secret) {
  throw new Error("AUTH_SECRET is not defined")
}
 
// Notice this is only an object, not a full Auth.js instance
export default {
  secret,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        const results = await sql`SELECT * FROM users WHERE email = ${credentials.email as string}`;
        const user = results[0];

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password)

        if (!isPasswordValid) {
          return null
        }

        return { id: user.id, name: user.name, email: user.email, image: user.image }
      },
    }),
  ],
} satisfies AuthOptions
