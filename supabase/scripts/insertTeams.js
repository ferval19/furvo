import { createClient } from '@supabase/supabase-js'


console.log('Insertamos datos...')
const supabase = createClient('https://osgmiaxwzajpcgssfmeg.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zZ21pYXh3emFqcGNnc3NmbWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI5NTAyOTcsImV4cCI6MjAwODUyNjI5N30.qbsTtF8Y7Sha_ZCJ8HR0kcGVw1QEo5uOAIkxI7NO2lc',{
    auth: { persistSession: false },
  })
const { error } = await supabase
  .from('teams')
  .insert({
    id:1,
    api_id: 33,
    name: "Manchester United",
    code: "MUN",
    country: "England",
    founded: 1878,
    national: false,
    logo: "https://media-3.api-sports.io/football/teams/33.png"
  })