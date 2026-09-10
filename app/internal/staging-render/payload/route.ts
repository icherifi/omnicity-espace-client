import { NextResponse } from "next/server";

/**
 * Never legitimately reached: stagingRenderService.ts intercepts this exact
 * request client-side via page.route() before navigating, and fulfills it with
 * the real payload directly - this handler only exists so the page has a real
 * URL to fetch from during normal (non-Playwright) development/testing, and as
 * defense in depth if something ever hits it directly.
 */
export async function GET() {
  return NextResponse.json({ error: "Not available outside a render session" }, { status: 404 });
}
