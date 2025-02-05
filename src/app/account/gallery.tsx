"use client"

import React, { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button, Box, CircularProgress, Typography } from "@mui/material"

export default function ImageUpload({ userId, onUpload }: { userId: string | null; onUpload: (url: string) => void }) {
  const supabase = createClient()
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const uploadImage: React.ChangeEventHandler<HTMLInputElement> = async event => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.")
      }

      const file = event.target.files[0]
      const fileExt = file.name.split(".").pop()
      const filePath = `uploads/${userId}/${Date.now()}-${Math.random()}.${fileExt}`

      const { data, error: uploadError } = await supabase.storage.from("images").upload(filePath, file, {
        upsert: true,
      })

      if (uploadError) {
        throw uploadError
      }

      const publicUrl = supabase.storage.from("images").getPublicUrl(filePath).data.publicUrl

      // Save the image URL in the `gallery` table in Supabase
      const { error: dbError } = await supabase.from("gallery").insert({
        user_id: userId,
        image_url: publicUrl,
      })

      if (dbError) {
        throw dbError
      }

      onUpload(publicUrl)
      setImageUrl(publicUrl)
    } catch (error) {
      alert("Error uploading image!")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      {imageUrl && (
        <img src={imageUrl} alt="Uploaded" style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }} />
      )}
      <Button
        variant="contained"
        component="label"
        disabled={uploading}
        startIcon={uploading && <CircularProgress size={20} />}
      >
        {uploading ? "Uploading ..." : "Upload Image"}
        <input type="file" hidden accept="image/*" onChange={uploadImage} disabled={uploading} />
      </Button>
      {imageUrl && (
        <Typography variant="body2" color="textSecondary">
          Public URL: {imageUrl}
        </Typography>
      )}
    </Box>
  )
}
