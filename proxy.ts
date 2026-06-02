import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { hasPublicSupabaseConfig, publicEnv } from "@/lib/config/env";

/**
 * Supabase session-refresh proxy. Next 16 renamed the `middleware` convention to
 * `proxy` (Node.js runtime). This is the auth scaffold (§6.1): it keeps the auth
 * token fresh so Phase 2 can read the session on the server. There is NO route
 * gating in Phase 1 — the core experience is open. When Supabase is unconfigured
 * (the Phase 1 default) it passes straight through.
 */
export async function proxy(request: NextRequest) {
  if (!hasPublicSupabaseConfig()) {
    return NextResponse.next();
  }

  const response = NextResponse.next({
    request: { headers: new Headers(request.headers) },
  });

  const supabase = createServerClient(publicEnv.supabaseUrl!, publicEnv.supabaseAnonKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Refreshes the session when present; a harmless no-op when logged out.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
