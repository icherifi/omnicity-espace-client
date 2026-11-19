import { createClient } from "@/utils/supabase/client";

export const ACCOUNT_NOT_APPROVED_EVENT = "omnicity:account-not-approved";

/**
 * fetch() for calls to the Omnicity API. Adds the central error handling the callers used
 * to ignore:
 *  - 401 (expired/invalid session)         -> sign out and go back to /login
 *  - 403 { code: "account_not_approved" }   -> tell the app to show the "pending activation" screen
 * The Response is returned untouched, so existing callers keep working.
 */
export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, init);

  if (response.status === 401 && typeof window !== "undefined") {
    await createClient().auth.signOut();
    window.location.assign("/login?message=session-expired");
  } else if (response.status === 403 && typeof window !== "undefined") {
    const body = await response.clone().json().catch(() => null);
    if (body?.code === "account_not_approved") {
      window.dispatchEvent(new Event(ACCOUNT_NOT_APPROVED_EVENT));
    }
  }

  return response;
}
