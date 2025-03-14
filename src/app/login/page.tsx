"use client"

import { useState } from "react"
import { login, signup } from "./actions"
import { TextField, Button, Box, Container, Typography } from "@mui/material"
import Link from "next/link"

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const actionType = (event.nativeEvent as SubmitEvent).submitter?.getAttribute("name")

    try {
      if (actionType === "login") {
        await login(formData)
      } else {
        await signup(formData)
      }
    } catch (error) {
      console.error("Authentication error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="xs">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 8, display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          id="email"
          name="email"
          label="Email"
          type="email"
          variant="outlined"
          required
          fullWidth
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <TextField
          id="password"
          name="password"
          label="Password"
          type="password"
          variant="outlined"
          required
          fullWidth
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <Button variant="contained" color="primary" type="submit" name="login" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </Button>

        <Button variant="outlined" color="secondary" type="submit" name="signup" disabled={loading}>
          {loading ? "Signing up..." : "Sign up"}
        </Button>
        <Typography variant="body2" sx={{ mt: 2 }}>
          <Link href="/forgot-password" passHref>
            Forgot your password?
          </Link>
        </Typography>
      </Box>
    </Container>
  )
}
