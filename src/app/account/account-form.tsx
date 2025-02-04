"use client"

import { useCallback, useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { type User } from "@supabase/supabase-js"
import Avatar from "./avatar"
import { TextField, Button, Box, Container, Typography, CircularProgress } from "@mui/material"

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error, status } = await supabase
        .from("profiles")
        .select("full_name, username, website, avatar_url")
        .eq("id", user?.id)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert("Error loading user data!")
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile() {
    try {
      setLoading(true)
      const { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert("Profile updated!")
    } catch (error) {
      alert("Error updating the data!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mt: 4 }}>
        <Avatar
          uid={user?.id ?? null}
          url={avatar_url}
          size={150}
          onUpload={url => {
            setAvatarUrl(url)
            updateProfile()
          }}
        />

        <Typography variant="h6">Profile Information</Typography>

        <TextField id="email" label="Email" type="text" value={user?.email} disabled fullWidth />
        <TextField
          id="fullName"
          label="Full Name"
          type="text"
          value={fullname || ""}
          onChange={e => setFullname(e.target.value)}
          fullWidth
        />
        <TextField
          id="username"
          label="Username"
          type="text"
          value={username || ""}
          onChange={e => setUsername(e.target.value)}
          fullWidth
        />
        <TextField
          id="website"
          label="Website"
          type="url"
          value={website || ""}
          onChange={e => setWebsite(e.target.value)}
          fullWidth
        />

        <Button variant="contained" color="primary" onClick={updateProfile} disabled={loading} fullWidth>
          {loading ? <CircularProgress size={24} /> : "Update"}
        </Button>

        <Button variant="outlined" color="secondary" href="/auth/signout" fullWidth>
          Sign Out
        </Button>
      </Box>
    </Container>
  )
}
