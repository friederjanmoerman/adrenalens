import * as React from "react"
import Typography from "@mui/material/Typography"
import { AppBar, Container, Toolbar } from "@mui/material"
import SignInButton from "../../atoms/SignInButton/SignInButton"
import SignOutButton from "../../atoms/SignOutButton/SignOutButton"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"

function ResponsiveAppBar() {
  const supabase = createClient()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }

    checkAuth()

    // Listen for authentication changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Adrenalens
          </Typography>

          {!isAuthenticated ? <SignInButton /> : <SignOutButton />}
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default ResponsiveAppBar
