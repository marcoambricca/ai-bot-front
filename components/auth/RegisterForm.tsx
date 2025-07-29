'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export function RegisterForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // Sign up with email/password
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })

    if (signUpError) {
      alert(signUpError.message)
      setLoading(false)
      return
    }

    const user = data.user
    if (!user) {
      alert('User signup failed')
      setLoading(false)
      return
    }

    // Insert into clients table
    const { error: insertError } = await supabase.from('clients').insert({
      id: user.id,
      name,
      email: user.email,
    })

    if (insertError) {
      alert('Error saving user info: ' + insertError.message)
      setLoading(false)
      return
    }

    alert('Registration successful! Please check your email to confirm your account.')
    setLoading(false)
    router.push('/dashboard')
  }

  async function handleGoogleSignIn() {
    setLoading(true)

    // Sign in with Google OAuth
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    // Supabase OAuth redirects user, so below code runs after redirect back
    // To handle post-login logic (like inserting into clients), you can:
    // - Use an auth state listener in your app
    // - Or check on dashboard load and insert if missing

    // But here's an example of how to insert after OAuth login if you handle session here:

    // Get current user
    const user = supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      // Check if client exists
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!existingClient) {
        // Insert new client record with minimal info
        const { error: insertError } = await supabase.from('clients').insert({
          id: user.id,
          name: user.user_metadata?.full_name || user.email || 'No Name',
          email: user.email,
        })
        if (insertError) alert('Error saving client info: ' + insertError.message)
      }

      router.push('/dashboard')
    })

    setLoading(false)
  }

  return (
    <form onSubmit={handleRegister} className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-balance text-sm text-muted-foreground">Enter your details below to create your account</p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Registering...' : 'Create Account'}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4">
            <title>Google</title>
            <path
              d="M12.48 10.92v3.28h7.81c-.21 1.5-1.84 4.2-7.81 4.2-4.65 0-8.44-3.79-8.44-8.44s3.79-8.44 8.44-8.44c2.94 0 4.92 1.31 5.97 2.3l2.3-2.29C18.73 1.29 15.5 0 12.48 0 5.87 0 .32 5.55.32 12.16c0 6.61 5.55 12.16 12.16 12.16 6.8 0 11.5-4.7 11.5-11.5 0-.79-.1-1.53-.22-2.25H12.48z"
              fill="currentColor"
            />
          </svg>
          Sign up with Google
        </Button>
      </div>
    </form>
  )
}

