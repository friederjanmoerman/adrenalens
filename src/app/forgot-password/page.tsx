"use client"

import { useState } from "react"
import { sendPasswordResetEmail } from "./../login/actions"
import { Container, TextField, Button, Box, Typography, CircularProgress, Alert } from "@mui/material"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)

    const formData = new FormData()
    formData.append("email", email)

    const response = await sendPasswordResetEmail(formData)

    if (response.error) {
      setError(response.error)
    } else {
      setMessage(response.success)
    }

    setLoading(false)
  }

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h5">Reset Password</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2, textAlign: "center" }}>
          Enter your email and we will send you a reset link.
        </Typography>

        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", mt: 2 }}>
          <TextField
            fullWidth
            type="email"
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <Button fullWidth type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Send Reset Link"}
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
