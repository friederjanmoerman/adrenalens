"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Type-cast for convenience (ideally, validate properly)
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error("Login error:", error.message)
    return redirect("/error")
  }

  // Revalidate pages if needed
  revalidatePath("/")
  // Navigate user
  redirect("/account")
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.error("Signup error:", error.message)
    return redirect("/error")
  }

  revalidatePath("/")
  redirect("/account")
}

/**
 * Sends password reset email
 */
export async function sendPasswordResetEmail(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`, // Make sure this URL is valid
  })

  if (error) {
    console.error("Password reset error:", error.message)
    return { error: error.message }
  }

  return { success: "Password reset link sent. Check your email!" }
}

/**
 * Updates the password after clicking the reset link
 */
export async function updatePassword(formData: FormData) {
  const supabase = await createClient()

  const newPassword = formData.get("password") as string

  const { error } = await supabase.auth.updateUser({ password: newPassword })

  if (error) {
    console.error("Password update error:", error.message)
    return { error: error.message }
  }

  // Optionally revalidate or redirect
  revalidatePath("/")
  redirect("/login?resetSuccess=true")
}
