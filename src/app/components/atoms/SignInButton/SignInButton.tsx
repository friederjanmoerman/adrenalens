"use client"

import { useRouter } from "next/navigation"
import { Button } from "@mui/material"

export default function SignInButton() {
  const router = useRouter()

  async function handleSignIn() {
    router.push("/login")
  }

  return (
    <Button variant="outlined" color="secondary" onClick={handleSignIn} fullWidth>
      Sign In
    </Button>
  )
}
