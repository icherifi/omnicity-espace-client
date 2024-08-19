import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import MenuBar from '@/components/menubar/menubar'

export default async function HomePage () {
  return (
    <MenuBar />
  )
}