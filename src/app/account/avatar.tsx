"use client"

import React, { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import Image from "next/image"
import { Avatar as MuiAvatar, Button, Box, CircularProgress } from "@mui/material"

export default function Avatar({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string | null
  url: string | null
  size: number
  onUpload: (url: string) => void
}) {
  const supabase = createClient()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage.from("avatars").download(path)
        if (error) {
          throw error
        }

        const url = URL.createObjectURL(data)
        setAvatarUrl(url)
      } catch (error) {
        console.log("Error downloading image: ", error)
      }
    }

    if (url) downloadImage(url)
  }, [url, supabase])

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async event => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.")
      }

      const file = event.target.files[0]
      const fileExt = file.name.split(".").pop()
      const filePath = `${uid}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
    } catch (error) {
      alert("Error uploading avatar!")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      {avatarUrl ? (
        <MuiAvatar src={avatarUrl} sx={{ width: size, height: size }} alt="Avatar" />
      ) : (
        <MuiAvatar sx={{ width: size, height: size, backgroundColor: "grey.300" }} />
      )}
      <Button
        variant="contained"
        component="label"
        disabled={uploading}
        startIcon={uploading && <CircularProgress size={20} />}
      >
        {uploading ? "Uploading ..." : "Upload"}
        <input type="file" hidden accept="image/*" onChange={uploadAvatar} disabled={uploading} />
      </Button>
    </Box>
  )
}
