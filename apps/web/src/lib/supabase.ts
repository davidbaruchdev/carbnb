import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ggkmoftaduzyqozpssnk.supabase.co'
const supabaseKey = 'sb_publishable_bdzb2OWmpUoM5B2H0o0Qmg_sj-w_-7G'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Car = {
  id: number
  owner: string
  model: string
  city: string
  price_per_day: number
  photo_url: string | null
  description: string | null
  created_at: string
}