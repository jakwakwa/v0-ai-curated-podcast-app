import NextAuth from "next-auth"
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session({ session, token }) {
      if (token.sub && session.user) {
        (session.user as typeof session.user & { id: string }).id = token.sub
      }
      return session
    },
  },
})
