import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from "@/utils/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { data: account } = await supabase.from('accounts').select('admin').eq('user', user?.id).single();

  if (!account?.admin) {
    return res.status(403).json({ error: "Not authorized" });
  }

  res.status(200).json({ user, account });
}
