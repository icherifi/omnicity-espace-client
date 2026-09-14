import { NextResponse } from "next/server";

/**
 * Never legitimately reached: the conversion script intercepts this exact
 * request client-side via page.route() before navigating, and fulfills it with
 * the real OBJ/MTL payload directly - this handler only exists so the page has
 * a real URL to fetch from during normal (non-Playwright) development/testing,
 * and as defense in depth if something ever hits it directly. Mirrors
 * /internal/staging-render/payload's own route.ts exactly.
 */
export async function GET() {
  return NextResponse.json({ error: "Not available outside a conversion session" }, { status: 404 });
}
