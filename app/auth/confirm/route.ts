import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

/** Only same-site relative paths: blocks open redirects such as ?next=//evil.com. */
function safeNext(next: string | null): string {
  if (next && next.startsWith("/") && !next.startsWith("//") && !next.includes("\\")) {
    return next;
  }
  return "/";
}

/**
 * Target of the links in the emails (confirm signup, reset password, change email, invite):
 * /auth/confirm?token_hash=...&type=signup|recovery|email_change|invite&next=/path
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNext(searchParams.get("next"));

  if (token_hash && type) {
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("Email link verification failed:", error.message);
  }

  return NextResponse.redirect(
    `${origin}/auth/error?type=${encodeURIComponent(type ?? "")}`,
  );
}
