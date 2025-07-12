"use client";
import { SignIn } from "@clerk/nextjs"

export default function Login() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
      <SignIn />
    </div>
  )
}
