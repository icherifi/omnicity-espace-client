"use client";
import { useAccount } from "@/contexts/account.context";

/** Who is signed in (replaces the hard-coded "Omnicity Admin" label). */
export default function CurrentUserLabel() {
  const { me } = useAccount();
  if (!me) return null;
  return <>{me.admin ? `${me.email} (admin)` : me.email}</>;
}
