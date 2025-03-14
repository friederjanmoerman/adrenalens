"use client"

import { useState } from "react"
import { updatePassword } from "./../login/actions"

import { Container, TextField, Button, Box, Typography, CircularProgress, Alert } from "@mui/material"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)

    const formData = new FormData()
    formData.append("password", password)

    const response = await updatePassword(formData)

    if (response.error) {
      setError(response.error)
    } else {
      setMessage("Password updated! Redirecting to login...")
      setTimeout(() => {
        window.location.href = "/login"
      }, 3000)
    }

    setLoading(false)
  }

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h5">Set New Password</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2, textAlign: "center" }}>
          Enter your new password below.
        </Typography>

        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", mt: 2 }}>
          <TextField
            fullWidth
            type="password"
            label="New Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <Button fullWidth type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Update Password"}
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
