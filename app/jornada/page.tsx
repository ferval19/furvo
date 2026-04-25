import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function JornadaIndexPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: memberships } = await supabase
    .from('league_members')
    .select('league_id, leagues(invite_code)')
    .eq('user_id', user.id)
    .limit(1);

  if (memberships && memberships.length > 0) {
    const code = (memberships[0] as any).leagues?.invite_code;
    redirect(`/jornada/${code}`);
  }
  redirect('/onboarding');
}
