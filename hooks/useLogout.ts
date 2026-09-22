"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { logout as logoutRequest } from "@/lib/api";

export function useLogout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await logoutRequest();
    } catch (err) {
      // Don't block on this: a client stuck logged-in is worse than a
      // token the backend never got to invalidate, so we still sign out
      // and redirect below either way.
      setError(err instanceof Error ? err.message : "Failed to log out.");
    } finally {
      await signOut({ redirect: false });
      router.push("/login");
      setIsLoading(false);
    }
  }, [router]);

  return { logout, isLoading, error };
}
