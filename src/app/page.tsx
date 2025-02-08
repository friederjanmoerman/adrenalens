"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Container, Box, Typography, CircularProgress, Button } from "@mui/material"
import Image from "next/image"
import Link from "next/link"

export default function LandingPage() {
  const supabase = createClient()
  const [images, setImages] = useState<{ id: string; image_url: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchImages() {
      setLoading(true)
      const { data, error } = await supabase
        .from("gallery")
        .select("id, image_url")
        .order("created_at", { ascending: false })
        .limit(6) // Get only the latest 6 images

      if (error) {
        console.error("Error fetching images:", error)
      } else {
        setImages(data || [])
      }

      setLoading(false)
    }

    fetchImages()
  }, [supabase])

  return (
    <Container maxWidth="lg">
      {/* HERO SECTION */}
      <Box sx={{ textAlign: "center", my: 6 }}>
        <Typography variant="h3" fontWeight="bold">
          Welcome to Adrenalens
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: "600px", mx: "auto", mt: 2 }}>
          A platform where photographers and extreme sports athletes connect, share, and monetize their images.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Button variant="contained" color="primary" sx={{ mx: 1 }} component={Link} href="/account">
            Get Started
          </Button>
          <Button variant="outlined" color="secondary" sx={{ mx: 1 }} component={Link} href="/gallery">
            Explore Gallery
          </Button>
        </Box>
      </Box>

      {/* RECENT UPLOADS SECTION */}
      <Typography variant="h4" sx={{ mt: 6, mb: 2, textAlign: "center" }}>
        Recent Uploads
      </Typography>

      {loading && <CircularProgress sx={{ display: "block", margin: "auto" }} />}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 2,
          mt: 2,
        }}
      >
        {images.map(image => (
          <Box key={image.id} sx={{ position: "relative", borderRadius: "8px", overflow: "hidden" }}>
            <Image
              src={image.image_url}
              alt="Gallery Image"
              width={300}
              height={200}
              layout="responsive"
              objectFit="cover"
              style={{ borderRadius: "8px" }}
            />
          </Box>
        ))}
      </Box>

      {/* VIEW MORE BUTTON */}
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button variant="contained" color="primary" component={Link} href="/gallery">
          View More
        </Button>
      </Box>
    </Container>
  )
}
