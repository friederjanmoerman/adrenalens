"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@mui/material"

export default function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <Button variant="outlined" color="secondary" onClick={handleSignOut} fullWidth>
      Sign Out
    </Button>
  )
}
