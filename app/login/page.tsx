import Link from "next/link"
import { Mic } from "lucide-react"
import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"

function SignInButton() {
  return <Button type="submit">Sign In</Button>
}

export default function Login({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Mic className="h-8 w-8" />
            <span className="text-2xl">AI Podcast Generator</span>
          </Link>
        </div>
        <form
          action={async (formData) => {
            "use server"
            try {
              await signIn("credentials", formData)
            } catch (error) {
              // Signin can throw an error, which Next.js redirects to the page with error in query string.
              // We don't need to do anything here, the page will re-render with the error message.
            }
          }}
          className="flex w-full flex-1 flex-col justify-center gap-2 text-foreground"
        >
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="mb-6 rounded-md border bg-inherit px-4 py-2"
            name="email"
            placeholder="you@example.com"
            required
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="mb-6 rounded-md border bg-inherit px-4 py-2"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <SignInButton />
          {searchParams?.error && (
            <p className="mt-4 bg-red-100 p-4 text-center text-red-600 dark:bg-red-900/30 dark:text-red-400">
              Authentication failed. Please check your credentials.
            </p>
          )}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account? The seed script creates one for you.
          </p>
        </form>
      </div>
    </div>
  )
}
