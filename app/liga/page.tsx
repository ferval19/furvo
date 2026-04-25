import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function LigaIndexPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: memberships } = await supabase
    .from('league_members')
    .select('league_id')
    .eq('user_id', user.id)
    .limit(1);

  if (memberships && memberships.length > 0) {
    redirect(`/liga/${memberships[0].league_id}`);
  }
  redirect('/onboarding');
}
