'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import LandingPage from '../components/LandingPage'

export default function Home() {
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          router.replace('/dashboard')
          return
        }
      } catch (e) {
        console.error('Error checking session:', e)
      } finally {
        setChecking(false)
      }
    }

    checkSession()

    // Subscribe to session changes
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/dashboard')
      } else {
        setChecking(false)
      }
    })

    return () => {
      subscription?.subscription.unsubscribe()
    }
  }, [router])

  if (checking) {
    return <div>Loading...</div>
  }

  return <LandingPage />
}

