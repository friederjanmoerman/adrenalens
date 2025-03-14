"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { type User } from "@supabase/supabase-js"
import Avatar from "./avatar"
import ImageUpload from "./gallery"
import { TextField, Button, Box, Container, Typography, CircularProgress } from "@mui/material"
import Image from "next/image"
import SignOutButton from "../components/atoms/SignOutButton/SignOutButton"
import ResponsiveAppBar from "../components/molecules/ResponsiveAppBar/ResponsiveAppBar"

export default function AccountForm({ user }: { user: User | null }) {
  // 1. Define ALL Hooks at the top level
  const supabase = createClient()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)
  const [imageUrls, setImageUrls] = useState<string[]>([])

  // 2. If user is not logged in, redirect (useEffect is unconditional)
  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [router, user])

  // 3. Prepare a callback to fetch user data & images
  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, username, website, avatar_url")
        .eq("id", user?.id)
        .single()

      if (profileError && profileError.code !== "PGRST116") {
        throw profileError
      }

      if (profileData) {
        setFullname(profileData.full_name)
        setUsername(profileData.username)
        setWebsite(profileData.website)
        setAvatarUrl(profileData.avatar_url)
      }

      // Fetch stored images from gallery
      const { data: images, error: imageError } = await supabase
        .from("gallery")
        .select("image_url")
        .eq("user_id", user?.id)

      if (imageError) throw imageError

      if (images) {
        setImageUrls(images.map(img => img.image_url))
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase, user?.id])

  // 4. Fetch data on mount if user is present
  useEffect(() => {
    if (user) {
      getProfile()
    }
  }, [user, getProfile])

  // 5. If user is null, show nothing — ensures no flicker or partial render
  if (!user) {
    return null
  }

  // 6. Update profile function
  async function updateProfile() {
    try {
      setLoading(true)
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
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

  // 7. Render component
  return (
    <>
      <ResponsiveAppBar></ResponsiveAppBar>
      <Container maxWidth="sm">
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mt: 4 }}>
          <Avatar
            uid={user.id}
            url={avatar_url}
            size={150}
            onUpload={url => {
              setAvatarUrl(url)
              updateProfile()
            }}
          />

          <Typography variant="h6">Profile Information</Typography>

          <TextField id="email" label="Email" type="text" value={user.email} disabled fullWidth />
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

          <Typography variant="h6" sx={{ mt: 4 }}>
            Upload Image to Gallery
          </Typography>
          <ImageUpload userId={user.id} onUpload={url => setImageUrls(prev => [...prev, url])} />

          {imageUrls.length > 0 && (
            <Box
              sx={{
                mt: 2,
                display: "flex",
                gap: 2,
              }}
            >
              {imageUrls.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt={`Uploaded ${index}`}
                  width={200}
                  height={200}
                  style={{ objectFit: "cover", borderRadius: "8px" }}
                />
              ))}
            </Box>
          )}

          <Button variant="contained" color="primary" onClick={updateProfile} disabled={loading} fullWidth>
            {loading ? <CircularProgress size={24} /> : "Update"}
          </Button>

          <SignOutButton />
        </Box>
      </Container>
    </>
  )
}
