import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LandingPage() {
  const { userId } = auth()
  
  // If user is authenticated, redirect to dashboard
  if (userId) {
    redirect("/dashboard")
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'hsl(var(--background))',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: '700',
        color: 'hsl(var(--foreground))',
        marginBottom: '1rem'
      }}>
        AI Podcast Curator
      </h1>
      <p style={{
        color: 'hsl(var(--muted-foreground))',
        fontSize: '1.25rem',
        marginBottom: '2rem',
        maxWidth: '32rem'
      }}>
        Create personalized podcast collections and enjoy weekly curated episodes powered by AI.
      </p>
      <Link href="/login">
        <Button size="lg">
          Get Started
        </Button>
      </Link>
    </div>
  )
}
