"use client"

import "./globals.css"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"

const theme = createTheme({
  palette: {
    mode: "dark", // Change to "dark" if needed
  },
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline /> {/* Resets default styles for consistency */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
