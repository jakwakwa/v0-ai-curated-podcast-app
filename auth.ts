import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"
import type { User } from "@/lib/types"
import authConfig from "./auth.config";
export const { handlers, signIn, signOut, auth } = NextAuth({
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

        const results = await sql<User>`SELECT * FROM users WHERE email = ${credentials.email as string}`
        const user = results[0]

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
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
  },
})
