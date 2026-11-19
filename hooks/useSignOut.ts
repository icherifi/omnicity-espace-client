"use client";
import { useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

/** Single logout implementation: ends the session then returns to the login page. */
export function useSignOut() {
  return useCallback(async () => {
    await createClient().auth.signOut();
    window.location.assign("/login");
  }, []);
}
