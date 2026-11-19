"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ACCOUNT_NOT_APPROVED_EVENT } from "@/utils/apiFetch";

export type AccountStatus = "loading" | "signedOut" | "pending" | "active";

export interface Me {
  id: string;
  email: string;
  approved: boolean;
  admin: boolean;
}

interface AccountContextType {
  status: AccountStatus;
  me: Me | null;
  /** Re-check with the server (e.g. after an administrator activated the account). */
  refresh: () => Promise<void>;
}

const AccountContext = createContext<AccountContextType | null>(null);

export default function AccountContextProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AccountStatus>("loading");
  const [me, setMe] = useState<Me | null>(null);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      setMe(null);
      setStatus("signedOut");
      return;
    }
    try {
      // Plain fetch on purpose: a 401 here must not trigger apiFetch's sign-out redirect loop.
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        setMe(null);
        setStatus("signedOut");
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body: Me = await res.json();
      setMe(body);
      setStatus(body.approved ? "active" : "pending");
    } catch (error) {
      console.error("Could not load the account", error);
      // Keep the previous status: a network blip must not lock an active user out.
      setStatus((current) => (current === "loading" ? "signedOut" : current));
    }
  }, []);

  useEffect(() => {
    refresh();
    // Fires on sign in / sign out / token refresh, including right after login,
    // which is when the project list used to be requested too early.
    const { data: listener } = createClient().auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setMe(null);
        setStatus("signedOut");
      } else if (event === "SIGNED_IN") {
        refresh();
      }
    });
    const onNotApproved = () => setStatus("pending");
    window.addEventListener(ACCOUNT_NOT_APPROVED_EVENT, onNotApproved);
    return () => {
      listener.subscription.unsubscribe();
      window.removeEventListener(ACCOUNT_NOT_APPROVED_EVENT, onNotApproved);
    };
  }, [refresh]);

  const value = useMemo(() => ({ status, me, refresh }), [status, me, refresh]);
  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) throw new Error("useAccount must be used within AccountContextProvider");
  return context;
}
